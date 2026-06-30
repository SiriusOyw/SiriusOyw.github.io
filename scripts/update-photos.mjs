/**
 * 摄影模块元数据更新脚本
 * 1. 读取 EXIF 数据（相机、镜头、光圈、ISO、快门、日期、GPS）
 * 2. 调用 mimo-v2.5 Vision 识别图片内容，生成标题/描述/分类
 * 3. 合并写入 public/data/photos.json
 */

import exifr from 'exifr';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PHOTOS_DIR = path.join(PROJECT_ROOT, 'public', 'photos');
const PHOTOS_JSON = path.join(PROJECT_ROOT, 'public', 'data', 'photos.json');
const API_BASE = 'https://api.xiaomimimo.com/v1';
const MODEL = 'mimo-v2.5';
const VISION_PROMPT = `你是一位专业摄影师。分析这张照片并返回 JSON：
{"title":"简短中文标题4-8字，有意境","description":"一句话描述15-25字，描述画面内容和氛围","category":"landscape|street|portrait|night|travel 其一","location":"拍摄地点（如能判断）"}
只返回 JSON，不要其他文字。`;

// ---- GPS → 中文地名映射 ----
const GPS_MAP = [
  { name: '北京', lat: [39.4, 41.0], lng: [115.4, 117.5] },
  { name: '上海', lat: [30.7, 31.9], lng: [120.8, 122.2] },
  { name: '广州', lat: [22.6, 23.5], lng: [112.9, 114.1] },
  { name: '深圳', lat: [22.4, 22.8], lng: [113.7, 114.5] },
  { name: '杭州', lat: [29.8, 30.8], lng: [119.8, 120.9] },
  { name: '苏州', lat: [30.9, 31.6], lng: [120.2, 121.1] },
  { name: '南京', lat: [31.7, 32.6], lng: [118.4, 119.2] },
  { name: '成都', lat: [30.0, 31.0], lng: [103.5, 104.9] },
  { name: '重庆', lat: [28.8, 30.0], lng: [105.7, 107.4] },
  { name: '西安', lat: [33.8, 34.7], lng: [108.2, 109.5] },
  { name: '武汉', lat: [29.9, 31.0], lng: [113.7, 114.8] },
  { name: '长沙', lat: [27.8, 28.8], lng: [112.4, 113.5] },
  { name: '黄山', lat: [29.9, 30.4], lng: [118.1, 118.4] },
  { name: '厦门', lat: [24.3, 24.7], lng: [117.9, 118.5] },
  { name: '丽江', lat: [26.5, 27.2], lng: [100.0, 100.4] },
  { name: '大理', lat: [25.4, 25.9], lng: [100.0, 100.5] },
  { name: '青岛', lat: [35.9, 36.4], lng: [120.1, 120.7] },
  { name: '大连', lat: [38.7, 39.2], lng: [121.1, 122.0] },
  { name: '哈尔滨', lat: [45.5, 46.0], lng: [126.3, 127.2] },
  { name: '拉萨', lat: [29.4, 29.9], lng: [90.9, 91.5] },
  { name: '三亚', lat: [18.1, 18.5], lng: [109.3, 109.9] },
  { name: '桂林', lat: [25.1, 25.5], lng: [110.1, 110.6] },
  { name: '无锡', lat: [31.3, 31.8], lng: [120.0, 120.6] },
  { name: '宁波', lat: [29.6, 30.2], lng: [121.2, 121.9] },
  { name: '昆明', lat: [24.7, 25.3], lng: [102.5, 103.1] },
  { name: '兰州', lat: [35.9, 36.2], lng: [103.5, 104.1] },
  { name: '乌鲁木齐', lat: [43.6, 43.9], lng: [87.3, 87.8] },
  { name: '福州', lat: [25.9, 26.2], lng: [119.1, 119.5] },
  { name: '济南', lat: [36.5, 36.8], lng: [116.8, 117.2] },
  { name: '太原', lat: [37.7, 38.0], lng: [112.4, 112.7] },
  { name: '沈阳', lat: [41.6, 41.9], lng: [123.3, 123.7] },
  { name: '长春', lat: [43.7, 44.0], lng: [125.2, 125.5] },
  { name: '合肥', lat: [31.7, 32.0], lng: [117.1, 117.3] },
  { name: '南昌', lat: [28.5, 28.8], lng: [115.7, 116.0] },
  { name: '贵阳', lat: [26.5, 26.8], lng: [106.5, 106.8] },
  { name: '南宁', lat: [22.7, 23.0], lng: [108.2, 108.5] },
  { name: '海口', lat: [19.9, 20.1], lng: [110.3, 110.5] },
  { name: '呼和浩特', lat: [40.7, 41.0], lng: [111.5, 111.9] },
  { name: '银川', lat: [38.4, 38.6], lng: [106.1, 106.4] },
  { name: '西宁', lat: [36.5, 36.8], lng: [101.6, 101.9] },
];

function gpsToLocation(lat, lng) {
  for (const city of GPS_MAP) {
    if (lat >= city.lat[0] && lat <= city.lat[1] && lng >= city.lng[0] && lng <= city.lng[1]) {
      return city.name;
    }
  }
  return `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`;
}

// ---- EXIF 提取 ----
async function extractExif(filePath) {
  const exif = await exifr.parse(filePath);

  const camera = exif.Make && exif.Model
    ? `${exif.Make} ${exif.Model}`
    : exif.Make || exif.Model || '';

  let lens = '';
  if (exif.LensModel) {
    lens = exif.LensModel;
  } else if (exif.LensInfo && Array.isArray(exif.LensInfo) && exif.LensInfo.length >= 2) {
    const [minF, maxF, minA] = exif.LensInfo;
    if (minF === maxF) {
      lens = `${Math.round(minF)}mm f/${minA}`;
    } else {
      lens = `${Math.round(minF)}-${Math.round(maxF)}mm f/${minA}`;
    }
  }

  let focalLength = '';
  if (exif.FocalLengthIn35mmFormat) {
    focalLength = `${exif.FocalLengthIn35mmFormat}mm`;
  } else if (exif.FocalLength) {
    focalLength = `${Math.round(exif.FocalLength)}mm`;
  }

  let aperture = '';
  if (exif.FNumber) {
    aperture = `f/${exif.FNumber}`;
  }

  let shutterSpeed = '';
  if (exif.ExposureTime) {
    if (exif.ExposureTime >= 1) {
      shutterSpeed = `${Math.round(exif.ExposureTime)}`;
    } else {
      const denom = Math.round(1 / exif.ExposureTime);
      shutterSpeed = `1/${denom}`;
    }
  }

  let date = '';
  if (exif.DateTimeOriginal) {
    date = exif.DateTimeOriginal.substring(0, 10);
  } else if (exif.DateTime) {
    date = exif.DateTime.substring(0, 10);
  }

  let location = '';
  if (exif.GPSLatitude != null && exif.GPSLongitude != null) {
    let lat = exif.GPSLatitude;
    let lng = exif.GPSLongitude;
    if (exif.GPSLatitudeRef === 'S') lat = -lat;
    if (exif.GPSLongitudeRef === 'W') lng = -lng;
    location = gpsToLocation(lat, lng);
  }

  return {
    camera,
    lens,
    focalLength,
    aperture,
    iso: exif.ISO ? `${exif.ISO}` : '',
    shutterSpeed,
    date,
    location,
  };
}

// ---- 图片尺寸 + 缩放 base64 ----
async function getImageInfoAndBase64(filePath) {
  const metadata = await sharp(filePath).metadata();
  const resized = await sharp(filePath)
    .resize({ width: 1024, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();
  return {
    width: metadata.width,
    height: metadata.height,
    base64: resized.toString('base64'),
  };
}

// ---- 调用 mimo-v2.5 Vision ----
async function callVision(base64) {
  const apiKey = process.env.MIMO_API_KEY;
  if (!apiKey) {
    throw new Error('MIMO_API_KEY 环境变量未设置');
  }

  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: VISION_PROMPT },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } },
          ],
        },
      ],
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Vision API 请求失败 (${response.status}): ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  let parsed;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    }
  } catch {
    // 解析失败
  }

  return parsed || null;
}

// ---- 主流程 ----
async function main() {
  console.log('=== 摄影模块元数据更新脚本 ===\n');

  const existingPhotos = JSON.parse(fs.readFileSync(PHOTOS_JSON, 'utf-8'));

  const files = fs.readdirSync(PHOTOS_DIR)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .sort();

  console.log(`找到 ${files.length} 张图片\n`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(PHOTOS_DIR, file);
    const photoId = `photo-${i + 1}`;
    const src = `/photos/${file}`;

    console.log(`--- [${i + 1}/${files.length}] ${file} ---`);

    // 1. EXIF 提取
    let exifData = {};
    try {
      exifData = await extractExif(filePath);
      console.log(`  EXIF: ${exifData.camera || '无相机'} | ${exifData.lens || '无镜头'} | ${exifData.aperture || '-'} | ISO ${exifData.iso || '-'} | ${exifData.shutterSpeed || '-'} | ${exifData.date || '无日期'}`);
      if (exifData.location) console.log(`  GPS: ${exifData.location}`);
    } catch (err) {
      console.log(`  EXIF 读取失败: ${err.message}`);
    }

    // 2. 图片尺寸 + base64
    let imageInfo;
    try {
      imageInfo = await getImageInfoAndBase64(filePath);
      console.log(`  尺寸: ${imageInfo.width}x${imageInfo.height}`);
    } catch (err) {
      console.log(`  图片处理失败: ${err.message}`);
      continue;
    }

    // 3. mimo-v2.5 Vision 识别
    let visionResult = null;
    try {
      console.log('  调用 mimo-v2.5 Vision 识别...');
      visionResult = await callVision(imageInfo.base64);
      if (visionResult) {
        console.log(`  Vision: "${visionResult.title}" - ${visionResult.description}`);
        console.log(`  分类: ${visionResult.category} | 地点: ${visionResult.location || '未知'}`);
      } else {
        console.log('  Vision 未返回有效结果');
      }
    } catch (err) {
      console.log(`  Vision 调用失败: ${err.message}`);
    }

    // 4. 合并数据
    const existing = existingPhotos.find(p => p.id === photoId) || {};
    const updated = {
      id: photoId,
      src,
      thumbnail: existing.thumbnail || src,
      title: visionResult?.title || existing.title || `照片 ${i + 1}`,
      description: visionResult?.description || existing.description || '',
      category: visionResult?.category || existing.category || 'landscape',
      location: visionResult?.location || exifData.location || existing.location || '',
      date: exifData.date || existing.date || '',
      camera: exifData.camera || existing.camera || '',
      lens: exifData.lens || existing.lens || '',
      focalLength: exifData.focalLength || existing.focalLength || '',
      aperture: exifData.aperture || existing.aperture || '',
      iso: exifData.iso || existing.iso || '',
      shutterSpeed: exifData.shutterSpeed || existing.shutterSpeed || '',
      width: imageInfo.width,
      height: imageInfo.height,
    };

    const idx = existingPhotos.findIndex(p => p.id === photoId);
    if (idx >= 0) {
      existingPhotos[idx] = updated;
    } else {
      existingPhotos.push(updated);
    }

    console.log(`  ✓ 已更新\n`);
  }

  fs.writeFileSync(PHOTOS_JSON, JSON.stringify(existingPhotos, null, 2) + '\n', 'utf-8');
  console.log(`=== 完成！已更新 ${PHOTOS_JSON} ===`);
}

main().catch(err => {
  console.error('脚本执行失败:', err);
  process.exit(1);
});
