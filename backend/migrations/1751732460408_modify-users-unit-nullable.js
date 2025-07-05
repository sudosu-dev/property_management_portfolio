export const up = (pgm) => {
  pgm.alterColumn("users", "unit", {
    notNull: false,
  });
};

export const down = (pgm) => {
  pgm.alterColumn("users", "unit", {
    notNull: true,
  });
};
