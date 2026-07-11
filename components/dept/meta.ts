/* department metadata — plain module so server pages can read it too */

export const DEPT_META: Record<string, { slate: string; title: string; sub: string }> = {
  ad: { slate: "AD DEPT · THE SLATE", title: "AD Dept — the slate", sub: "hit the sticks on the frame" },
  camera: { slate: "CAMERA DEPT · FOCUS PULL", title: "Camera Dept — the focus pull", sub: "keep the subject sharp for thirty seconds" },
  edit: { slate: "EDITORIAL · THE CUT", title: "Editorial — the cut", sub: "rebuild the scene before the clock runs" },
  runner: { slate: "TRANSPORT · REEL RUN", title: "Transport — the reel run", sub: "roll the can across the lot" },
};
