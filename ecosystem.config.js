module.exports = {
  apps: [
    {
      name: "xrponline",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        HOST: "0.0.0.0",
        PORT: "80",
      },
    },
  ],
};