//PEGAR ARRAY SALVO NO STORAGE
const precostetos = JSON.parse(localStorage.getItem("tetos")) || []

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


  const VerificarPessoal = precostetos.some((item) => {
    if(encontrar){
      return item.ticker == encontrar.stock
    }else{
      return true
    }
  })


  if(encontrar && precoTeto && !VerificarPessoal){
    precostetos.push({ticker: encontrar.stock, precoTeto: precoTeto})

    localStorage.setItem("tetos", JSON.stringify(precostetos))
    mgs.style.display = "none"

  }else{
    mgs.style.display = "flex"
  }

  ProcessarDados(ExibirResultado)
}



//RETORNAR O ARRAY COM OS PREÇOS ATUAIS
async function ProcessarDados(callback) {
  const api = await RetornarApi();

  const result = precostetos.map((item) => {

    const filtro = api.find((valor) => {
        return item.ticker == valor.stock
    });


    const alteraçoes = {
        ticker: item.ticker,
        precoTeto: item.precoTeto,
        PrecoAtual: filtro.close,
        compra: item.precoTeto > filtro.close ? true : false,
        logo: filtro.logo
      }


    return alteraçoes
  });

  callback(result)
}




//CALCULAR MARGEM

function ExibirResultado(dados) {

  let boasvindas = document.querySelector(".boasvindas")
  let suasMargens = document.querySelector(".SuasMargens")

  if(precostetos[0]){
    boasvindas.classList.add("sumir")
    suasMargens.classList.remove("sumir")
  }else{
    boasvindas.classList.remove("sumir")
    suasMargens.classList.add("sumir")
  }


  let AcimaTeto = document.getElementById("AcimaDoTeto")
  let AbaixoTeto = document.getElementById("AbaixoTeto")
  let carasEbaratas = {caras: 0, baratas: 0}

  let htmlMargem = document.getElementById("containerMargem");
  htmlMargem.innerHTML = ""

  dados.forEach((index) => {

    let calculo = ((index.precoTeto - index.PrecoAtual) / index.precoTeto) * 100;

    index.MargemdeCompra = Number(calculo.toFixed(2))


    htmlMargem.innerHTML += `
              <div class="ativo" id="${index.ticker}">

                  <div class="ativoNome">                            
                      <img src="${index.logo}" alt="">
    
                      <div>
                          <h3> ${index.ticker} </h3>
                          <p>Teto: ${index.precoTeto} R$</p>
                      </div>
                  </div>

                    <div class="ativoMargem">
                      <div>
                          <label>Atual</label>
                          <h3>R$ ${index.PrecoAtual} </h3>
                      </div>
                      <div>
                          <label> Margem </label>
                          <h3> ${index.MargemdeCompra}% </h3>
                      </div>

                      <img src="img/trash.png" id="trash${index.ticker}" alt="deletar" onclick="deletar('${index.ticker}')" onmouseover="mudarTrash('trash${index.ticker}')" onmouseout="mudarTrash('trash${index.ticker}')">
                  </div>

              </div>
    `

    //EXIBIR AS ACOES CARAS E BARATAS
    

    if(index.compra == false){
      carasEbaratas.caras += 1
    }else{
      carasEbaratas.baratas += 1
    }
    
    
    
  });
  
  AcimaTeto.textContent = carasEbaratas.caras
  AbaixoTeto.textContent = carasEbaratas.baratas


  //EXIBIR NO CARD O TOTAL DE ACOES
  let totalAcoes = document.getElementById("TotalAçoes")
  let TotalAçoesSpan = document.getElementById("TotalAçoesSpan")

  TotalAçoesSpan.innerHTML = dados.length + " Ações com preço teto!"
  totalAcoes.innerHTML = dados.length




  //MELHOR OPORTUNIDADE
  const melhor = dados.reduce((acum, item) => {

    return acum.MargemdeCompra > item.MargemdeCompra ? acum : item

  }, {MargemdeCompra: 0})
  
  let melhorId = document.getElementById("Melhor")
  let melhorSpan = document.getElementById("melhorSpan")
  
  melhorId.innerHTML = melhor.ticker || "---"
  melhorSpan.innerHTML = " + " + melhor.MargemdeCompra + "% de margem"
}


ProcessarDados(ExibirResultado)



//ADICIONA EXEMPLOS PARA USUARIOS SEM PRECOS TETOS ADICIONADOS

function addExemplo(){
  let botao = document.getElementById("exemploButton")

  botao.disabled = true

  setInterval(() => {
    botao.disabled = false
  }, 1000)

  precostetos.push({ticker: "PETR4", precoTeto: 40}, {ticker: "VALE3", precoTeto: 70}, {ticker: "ITUB4", precoTeto: 45})

  localStorage.setItem("tetos", JSON.stringify(precostetos))

  ProcessarDados(ExibirResultado)
}


//FUNCAO QUE MUDA A IMAGEM DE DELETAR

function mudarTrash(idTrash){
  let trash = document.getElementById(idTrash)


  if(trash.src == "http://127.0.0.1:5500/img/trash.png"){
    trash.src = "img/trashred.png"
  }else{
    trash.src = "img/trash.png"
  }
}

function deletar(id){

  let ativo = document.getElementById(id)
  ativo.remove()

  precostetos.forEach((item, index) => {
    if(item.ticker == id){
      precostetos.splice(index, 1)
    }
  })

  localStorage.setItem("tetos", JSON.stringify(precostetos))

  ProcessarDados(ExibirResultado)
}