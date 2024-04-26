import api from "../configs/apiKey.json";

async function callAPI(arg, props) {
  console.log(`Status: ${arg.changes.workflowStatus.to.attributes.name}`);
  if (arg.changes.workflowStatus.to.attributes.name === "Released") {
    console.log("Status == Released. Api called.");

    try {
      const response = await fetch(
        "https://aha-endpoints-migration.srilan-catalinio.workers.dev/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            API_KEY: api.apiKey,
          },
        }
      );

      const json = await response.json();

      if (response.ok) {
        console.log(`Response: ${JSON.stringify(json.status)}`);
        console.log(`Props: ${props}`);
      }

      if (!response.ok) {
        console.log("Response not OK.");
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Status != Released. Api not called.");
  }
}

export default callAPI;

aha.on({ event: "aha.update.Feature.workflowStatus" }, (arg, props) => {
  callAPI(arg, props);
});
