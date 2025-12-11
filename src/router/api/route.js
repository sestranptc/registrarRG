async function postData() {
  const url = "https://api.exemplo.com/endpoint";

  const data = {
    nome: "Arthur",
    idade: 25
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  console.log(result);
}

postData();