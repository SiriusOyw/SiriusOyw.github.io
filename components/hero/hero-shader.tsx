'use client';

import { useRef, useEffect } from 'react';

export default function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false }) ||
               canvas.getContext('webgl', { alpha: true, antialias: false });
    if (!gl) return;

    // Capture non-null refs
    const cvs = canvas;
    const ctx = gl;

    const vsSource = [
      'attribute vec2 position;',
      'void main() {',
      '  gl_Position = vec4(position, 0.0, 1.0);',
      '}'
    ].join('\n');

    const fsSource = [
      'precision highp float;',
      'uniform vec2 resolution;',
      'uniform float time;',
      'uniform float xScale;',
      'uniform float yScale;',
      'uniform float distortion;',
      'uniform vec2 mouse;',
      'void main() {',
      '  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);',
      '  float d = length(p) * distortion;',
      '  float rx = p.x * (1.0 + d);',
      '  float gx = p.x;',
      '  float bx = p.x * (1.0 - d);',
      '  float r = 0.05 / abs(p.y + sin((rx + time) * xScale + mouse.x * 0.5) * yScale);',
      '  float g = 0.05 / abs(p.y + sin((gx + time) * xScale + mouse.y * 0.5) * yScale);',
      '  float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);',
      '  gl_FragColor = vec4(r, g, b, 1.0);',
      '}'
    ].join('\n');

    const vs = ctx.createShader(ctx.VERTEX_SHADER)!;
    ctx.shaderSource(vs, vsSource);
    ctx.compileShader(vs);

    const fs = ctx.createShader(ctx.FRAGMENT_SHADER)!;
    ctx.shaderSource(fs, fsSource);
    ctx.compileShader(fs);

    if (!ctx.getShaderParameter(fs, ctx.COMPILE_STATUS)) {
      return;
    }

    const prog = ctx.createProgram()!;
    ctx.attachShader(prog, vs);
    ctx.attachShader(prog, fs);
    ctx.linkProgram(prog);
    ctx.useProgram(prog);

    const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, -1, 1, 1, 1]);
    const buf = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
    ctx.bufferData(ctx.ARRAY_BUFFER, verts, ctx.STATIC_DRAW);

    const loc = ctx.getAttribLocation(prog, 'position');
    ctx.enableVertexAttribArray(loc);
    ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0);

    const uRes = ctx.getUniformLocation(prog, 'resolution');
    const uTime = ctx.getUniformLocation(prog, 'time');
    const uXScale = ctx.getUniformLocation(prog, 'xScale');
    const uYScale = ctx.getUniformLocation(prog, 'yScale');
    const uDist = ctx.getUniformLocation(prog, 'distortion');
    const uMouse = ctx.getUniformLocation(prog, 'mouse');

    const resize = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
      ctx.viewport(0, 0, cvs.width, cvs.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      ctx.uniform2f(uMouse,
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1
      );
    };
    window.addEventListener('mousemove', handleMouse);

    let t = 0;
    let animId: number;

    function draw() {
      t += 0.008;
      ctx.uniform1f(uTime, t);
      ctx.uniform2f(uRes, cvs.width, cvs.height);
      ctx.uniform1f(uXScale, 1.0);
      ctx.uniform1f(uYScale, 0.5);
      ctx.uniform1f(uDist, 0.05);
      ctx.clear(ctx.COLOR_BUFFER_BIT);
      ctx.drawArrays(ctx.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.9 }}
    />
  );
}
