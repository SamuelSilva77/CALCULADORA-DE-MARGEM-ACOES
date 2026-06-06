const precostetos = [
  {
    ticker: "BBSE3",
    precoTeto: 42.27,
  },
  {
    ticker: "SAPR4",
    precoTeto: 9.39,
  },
  {
    ticker: "BBAS3",
    precoTeto: 25,
  },
  {
    ticker: "TAEE4",
    precoTeto: 15.76,
  },
  {
    ticker: "ABCB4",
    precoTeto: 29.51,
  },
];

//RETORNA API
async function RetornarApi() {
  try {
    const resposta = await fetch(
      "https://brapi.dev/api/quote/list?limit=1000",
      {
        headers: {
          Authorization: "Bearer nYdsxS6zqWxCBpDgR8xbuk",
        },
      },
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert("erro");
    }

    return dados.stocks;
  } catch (err) {
    alert("ERRO " + err);
  }
}

//ADICIONAR AÇAO AO ARRAY

async function adicionarAcao(e){
  e.preventDefault()

  let ticker = document.getElementById("ticker").value
  let precoTeto = Number(document.getElementById("precoTeto").value)
  let mgs = document.getElementById("aviso")
  
  let dados = await RetornarApi()

  const encontrar = dados.find((item) => {
    return item.stock == ticker.toUpperCase()
  })

  if(encontrar && precoTeto){
    precostetos.push({ticker: encontrar.stock, precoTeto: precoTeto})
    mgs.style.display = "none"
  }else{
    mgs.style.display = "flex"
  }
}

//RETORNAR O ARRAY COM OS PREÇOS ATUAIS
async function ProcessarDados() {
  const api = await RetornarApi();

  const result = precostetos.map((item) => {

    const filtro = api.find((valor) => {
        return item.ticker == valor.stock
    });

    const alteraçoes = {
        ticker: item.ticker,
        precoTeto: item.precoTeto,
        PrecoAtual: filtro.close,
        compra: item.precoTeto > filtro.close ? true : false
      }


    return alteraçoes
  });

  return result;
}

//CALCULAR MARGEM

async function calcularMargem() {
  const dados = await ProcessarDados();

  console.log(dados);

  dados.forEach((index) => {

    let calculo = ((index.precoTeto - index.PrecoAtual) / index.precoTeto) * 100;

    index.MargemdeCompra = calculo.toFixed(2)

    console.log(
      "A margem de: " +
        index.ticker +
        " é de " +
        calculo.toFixed(2) +
        "%",
    );
  });
}

calcularMargem();

