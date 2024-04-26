async function updateCWTicketStatus(json, CWId) {
  const modifiedJson = {
    ...json,
    status: {
      ...json.status,
      id: 449,
    },
  };

  const response = await fetch(
    `https://sandbox-na.myconnectwise.net/v4_6_release/apis/3.0/service/tickets/${CWId}`,
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
      `${CWId}'s status was successfully updated to ${JSON.stringify(
        ticket.status.name
      )}`
    );
  }

  if (!response.ok) {
    console.log("API call failed.");
  }
}

async function getCWTicket(CWId) {
  try {
    const response = await fetch(
      `https://sandbox-na.myconnectwise.net/v4_6_release/apis/3.0/service/tickets/${CWId}?conditions=status/name='New'`,
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
      updateCWTicketStatus(json, CWId);
    }

    if (!response.ok) {
      console.log("API call failed.");
    }
  } catch (error) {
    console.log(error);
  }
}

async function ahaToCWTicket(ahaId) {
  const response = await fetch(
    `https://trajector1.aha.io/api/v1/features/${ahaId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer c91c04bc38114c2cbc727a42ec1bee8ef6b05361b363ef685bb4e46945bb76fd`,
      },
    }
  );

  if (response.ok) {
    const json = await response.json();
    const CWId = JSON.parse(json.feature.custom_fields[1].body);
    getCWTicket(CWId);
  } else {
    console.error("API call failed:", await response.text());
  }
}

export default getCWTicket;

aha.on({ event: "aha.update.Feature.workflowStatus" }, (arg) => {
  console.log(`Status: ${arg.changes.workflowStatus.to.attributes.name}`);
  if (arg.changes.workflowStatus.to.attributes.name === "Released") {
    console.log("Status == Released. Api called.");
    const ahaId = arg.record.attributes.id;
    ahaToCWTicket(ahaId);
  } else {
    console.log("Status != Released. Api not called.");
  }
});
