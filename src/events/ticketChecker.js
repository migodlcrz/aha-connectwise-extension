async function updateCWTicketStatus(json, ticketId) {
  const modifiedJson = {
    ...json,
    status: {
      ...json.status,
      id: 449,
    },
  };

  const response = await fetch(
    `https://sandbox-na.myconnectwise.net/v4_6_release/apis/3.0/service/tickets/${ticketId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        clientId: "dda341d3-f8bc-4fc1-9b99-e6721e35bae7",
        Authorization:
          "Basic YW5jaG9yc2l4X2NzMStMVTh4Z3dmRkxKaEZkUFVEOmdaTlN0N1M5Vm04MW9mRjE=",
      },
      body: JSON.stringify(modifiedJson),
    }
  );

  const ticket = await response.json();

  if (response.ok) {
    console.log(
      `Status was successfully updated to ${JSON.stringify(ticket.status.name)}`
    );
  }

  if (!response.ok) {
    console.log("API call failed.");
  }
}

async function getCWTicket(arg, ticketId) {
  console.log(`Status: ${arg.changes.workflowStatus.to.attributes.name}`);
  if (arg.changes.workflowStatus.to.attributes.name === "Released") {
    console.log("Status == Released. Api called.");

    try {
      const response = await fetch(
        `https://sandbox-na.myconnectwise.net/v4_6_release/apis/3.0/service/tickets/${ticketId}?conditions=status/name='New'`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            clientId: "dda341d3-f8bc-4fc1-9b99-e6721e35bae7",
            Authorization:
              "Basic YW5jaG9yc2l4X2NzMStMVTh4Z3dmRkxKaEZkUFVEOmdaTlN0N1M5Vm04MW9mRjE=",
          },
        }
      );

      const json = await response.json();

      if (response.ok) {
        updateCWTicketStatus(json, ticketId);
      }

      if (!response.ok) {
        console.log("API call failed.");
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Status != Released. Api not called.");
  }
}

export default getCWTicket;

aha.on({ event: "aha.update.Feature.workflowStatus" }, (arg) => {
  const ticketId = 100;
  getCWTicket(arg, ticketId);
});
