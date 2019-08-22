module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgress',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
