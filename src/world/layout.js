/** Fixed positions of things in the world that more than one file needs to know about. */
export const PROJECT_X0 = 168;
export const PROJECT_DX = 14;
export const projectPos = (i) => [PROJECT_X0 + i * PROJECT_DX, 0, i % 2 === 0 ? -3.4 : -3.9];

/** Camera pose used when a project hologram is selected. */
export const projectFocus = (i) => {
  const [x, , z] = projectPos(i);
  return { cam: [x + 1.7, 2.9, z + 5.6], look: [x + 1.7, 2.7, z] };
};

export const DESK = { x: 250, z: 0 };
export const SCHOOL_GATE_X = 58;
export const COLLEGE_GATE_X = 104;
export const SUNRISE_X = 322;
