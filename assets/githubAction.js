export default {
  name: "CI",
  on: {
    push: {
      branches: ["master"],
    },
  },
  jobs: {
    build: {
      "runs-on": "ubuntu-latest",
      steps: [
        {
          name: "HTTP Request Action",
          uses: "fjogeleit/http-request-action@v1.8.1",
          with: {
            url: "https://todo-server-one.vercel.app/api/update",
            method: "POST",
            data: '{  "id":"12345354" }',
          },
        },
      ],
    },
  },
};
