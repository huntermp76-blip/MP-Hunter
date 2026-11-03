/**
 * Generates lightweight, realistic sample files using HTML5 Canvas
 * so users can test compression instantly with 1-click.
 */

export async function createSamplePassportPhoto(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 750;
  const ctx = canvas.getContext('2d')!;

  // Light blue studio background (standard Indian passport photo backdrop)
  const grad = ctx.createLinearGradient(0, 0, 0, 750);
  grad.addColorStop(0, '#dbeafe');
  grad.addColorStop(1, '#bfdbfe');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 750);

  // Body / Shoulders (Dark formal blazer)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(300, 680, 240, 160, 0, 0, Math.PI * 2);
  ctx.fill();

  // White formal shirt collar
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(240, 560);
  ctx.lineTo(300, 640);
  ctx.lineTo(360, 560);
  ctx.lineTo(320, 530);
  ctx.lineTo(280, 530);
  ctx.closePath();
  ctx.fill();

  // Neck
  ctx.fillStyle = '#e29578';
  ctx.fillRect(265, 430, 70, 110);

  // Head / Face
  ctx.fillStyle = '#eeb398';
  ctx.beginPath();
  ctx.ellipse(300, 360, 130, 160, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.ellipse(300, 240, 135, 80, 0, Math.PI, 0);
  ctx.fill();

  // Eyebrows & Eyes
  ctx.fillStyle = '#374151';
  ctx.fillRect(230, 320, 45, 6);
  ctx.fillRect(325, 320, 45, 6);

  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.arc(250, 345, 9, 0, Math.PI * 2);
  ctx.arc(350, 345, 9, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#c2410c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(300, 420, 35, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Name plate & date at bottom (Mandatory for SSC / Vyapam exams!)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(100, 670, 400, 60);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.strokeRect(100, 670, 400, 60);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RAHUL SHARMA', 300, 696);
  ctx.font = '15px sans-serif';
  ctx.fillText('DOB: 15/08/2000 | DOP: 20/03/2026', 300, 718);

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95)
  );
  return new File([blob], 'Sample_Passport_Photo.jpg', { type: 'image/jpeg' });
}

export async function createSampleSignature(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 250;
  const ctx = canvas.getContext('2d')!;

  // White paper texture background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 600, 250);

  // Blue ink signature
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(120, 160);
  ctx.bezierCurveTo(140, 70, 190, 80, 200, 150);
  ctx.bezierCurveTo(210, 190, 230, 90, 260, 130);
  ctx.bezierCurveTo(280, 160, 300, 110, 330, 145);
  ctx.bezierCurveTo(360, 170, 390, 100, 420, 135);
  ctx.lineTo(480, 140);
  ctx.stroke();

  // Underline flourish
  ctx.beginPath();
  ctx.moveTo(140, 175);
  ctx.quadraticCurveTo(300, 195, 460, 170);
  ctx.stroke();

  // Two dots
  ctx.fillStyle = '#1d4ed8';
  ctx.beginPath();
  ctx.arc(430, 190, 3.5, 0, Math.PI * 2);
  ctx.arc(450, 188, 3.5, 0, Math.PI * 2);
  ctx.fill();

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95)
  );
  return new File([blob], 'Sample_Signature_Hastakshar.jpg', { type: 'image/jpeg' });
}

export async function createSampleCameraPhoto(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d')!;

  // Vibrant sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 700);
  skyGrad.addColorStop(0, '#0284c7');
  skyGrad.addColorStop(0.6, '#38bdf8');
  skyGrad.addColorStop(1, '#fde047');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1920, 700);

  // Sun
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(1400, 300, 100, 0, Math.PI * 2);
  ctx.fill();

  // Distant Mountains
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(0, 700);
  ctx.lineTo(400, 350);
  ctx.lineTo(800, 650);
  ctx.lineTo(1200, 400);
  ctx.lineTo(1600, 680);
  ctx.lineTo(1920, 500);
  ctx.lineTo(1920, 1080);
  ctx.lineTo(0, 1080);
  ctx.closePath();
  ctx.fill();

  // Foreground rolling green hills
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.moveTo(0, 1080);
  ctx.bezierCurveTo(500, 650, 1000, 850, 1920, 750);
  ctx.lineTo(1920, 1080);
  ctx.closePath();
  ctx.fill();

  // High-frequency noise/details so it simulates a real 2MB - 4MB mobile camera photo
  const imgData = ctx.getImageData(0, 0, 1920, 1080);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 16) {
    const noise = (Math.random() - 0.5) * 15;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px sans-serif';
  ctx.fillText('Indore Rajwada Heritage Travel 4K', 80, 150);

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.98)
  );
  return new File([blob], 'Sample_Camera_Photo_4K.jpg', { type: 'image/jpeg' });
}
