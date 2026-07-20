# Guia: API de Cotações com Google Apps Script

Este script lê a aba `Ativos`, busca a cotação usando a fórmula `GOOGLEFINANCE` em uma aba temporária, consolida os resultados na aba `Cotações` e fornece um endpoint JSON (`doGet`) e de INSERÇÃO (`doPost`) para consumo em seus aplicativos.

## 1. O Código do Script

Copie o código abaixo e cole no editor do Google Apps Script (veja o Passo 2).

```javascript
/**
 * Atualiza cotações usando GOOGLEFINANCE.
 */
function atualizarCotacoes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let abaAtivos = ss.getSheetByName('Ativos');
  if (!abaAtivos) {
     abaAtivos = ss.insertSheet('Ativos');
  }
  
  // Garante que a moeda USDBRL sempre esteja rastreada para converter Stocks/REITs
  const ativosExistentes = abaAtivos.getDataRange().getValues();
  let hasUsd = false;
  for (let i = 0; i < ativosExistentes.length; i++) {
    if (ativosExistentes[i][0] === "CURRENCY:USDBRL") hasUsd = true;
  }
  if (!hasUsd) abaAtivos.appendRow(["CURRENCY:USDBRL"]);

  let abaCotacoes = ss.getSheetByName('Cotações');
  if (!abaCotacoes) {
    abaCotacoes = ss.insertSheet('Cotações');
    abaCotacoes.appendRow(['TICKER', 'ULTIMA_COTACAO', 'DATA_ATUALIZACAO']);
    abaCotacoes.getRange("A1:C1").setFontWeight("bold").setBackground("#f3f3f3");
  }

  const ativosData = abaAtivos.getRange(1, 1, abaAtivos.getLastRow(), 1).getValues();
  const cotacoesData = abaCotacoes.getDataRange().getValues();
  const cotacoesMap = {};
  for (let i = 1; i < cotacoesData.length; i++) {
    cotacoesMap[cotacoesData[i][0]] = i + 1;
  }

  let abaTemp = ss.getSheetByName('Temp_Finance_API');
  if (!abaTemp) {
    abaTemp = ss.insertSheet('Temp_Finance_API');
    abaTemp.hideSheet();
  }

  // Iterar para atualizar a data de hoje.
  const dataHoje = new Date();
  
  for (let i = 0; i < ativosData.length; i++) {
    const tickerOriginal = ativosData[i][0];
    if (!tickerOriginal || tickerOriginal === "TICKER") continue;

    abaTemp.getRange("A1").setFormula(`=GOOGLEFINANCE("${tickerOriginal}"; "price")`);
    SpreadsheetApp.flush();

    let attempt = 0;
    let price = abaTemp.getRange("A1").getValue();
    
    while ((price === '#N/A' || price === '' || typeof price === 'string') && attempt < 4) {
      Utilities.sleep(1000);
      price = abaTemp.getRange("A1").getValue();
      attempt++;
    }

    if (typeof price === 'number') {
      if (cotacoesMap[tickerOriginal]) {
        const row = cotacoesMap[tickerOriginal];
        abaCotacoes.getRange(row, 2).setValue(price);
        abaCotacoes.getRange(row, 3).setValue(dataHoje);
      } else {
        abaCotacoes.appendRow([tickerOriginal, price, dataHoje]);
        cotacoesMap[tickerOriginal] = abaCotacoes.getLastRow();
      }
    }
  }

  abaTemp.clear();
}

/**
 * Endpoint acionado ao fazer uma requisição GET para a Web App URL
 * Retorna os dados da aba "Cotações" em formato JSON.
 */
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const abaCotacoes = ss.getSheetByName('Cotações');

  if (!abaCotacoes) {
    return ContentService.createTextOutput(JSON.stringify({ 
      error: "Aba 'Cotações' não encontrada." 
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const data = abaCotacoes.getDataRange().getValues();
  
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const jsonData = [];
  const headers = data[0]; 

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const item = {};
    for (let j = 0; j < headers.length; j++) {
      item[headers[j]] = row[j];
    }
    jsonData.push(item);
  }

  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Recebe novos tickers enviados do nosso App React e salva na Aba "Ativos"
 */
function doPost(e) {
  try {
    let payload;
    // O fetch no App envia como text/plain para evitar strict CORS check no browser
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = JSON.parse(Object.keys(e.parameter)[0]); // Fallback se passar como form params do fetch
    }
    
    // CASO DE SINCRONIZAÇÃO FORÇADA
    if (payload && payload.action === 'sync') {
      atualizarCotacoes();
      return doGet(e); // Retorna as cotações recém-atualizadas
    }

    // CASO DE ADIÇÃO 
    if (payload && payload.action === 'add' && payload.ticker) {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const abaAtivos = ss.getSheetByName('Ativos');
      
      const data = abaAtivos.getDataRange().getValues();
      let exists = false;
      for (let i = 0; i < data.length; i++) {
         if (data[i][0] === payload.ticker) exists = true;
      }
      
      if (!exists) {
         abaAtivos.appendRow([payload.ticker]);
         // Atualiza assim que der para trazer a cotação rapidamente
         atualizarCotacoes(); 
      }
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, ticker: payload.ticker }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (payload && payload.action === 'delete' && payload.ticker) {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      
      const abaAtivos = ss.getSheetByName('Ativos');
      if (abaAtivos) {
        const dataAtivos = abaAtivos.getDataRange().getValues();
        for (let i = dataAtivos.length - 1; i >= 0; i--) {
          if (dataAtivos[i][0] === payload.ticker) {
            abaAtivos.deleteRow(i + 1);
          }
        }
      }

      const abaCotacoes = ss.getSheetByName('Cotações');
      if (abaCotacoes) {
        const dataCotacoes = abaCotacoes.getDataRange().getValues();
        for (let i = dataCotacoes.length - 1; i >= 0; i--) {
          if (dataCotacoes[i][0] === payload.ticker) {
            abaCotacoes.deleteRow(i + 1);
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ success: true, deleted: payload.ticker }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Ação ignorada' }))
        .setMimeType(ContentService.MimeType.JSON);
        
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
        .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 2. Como copiar e colar o script no Google Apps Script

1. Abra a sua planilha do **Google Sheets**.
2. Garanta que a sua planilha tenha uma aba nomeada exatamente como **`Ativos`**. (Não precisa ter nada preenchido, o App pode cadastrar agora!).
3. No menu superior da planilha, clique em **Extensões** > **Apps Script**.
4. Irá abrir uma nova guia com o editor de código.
5. Apague qualquer código e **copie e substitua por esse novo (que agora tem o doPost)**.
6. Pressione **Ctrl + S** (ou Cmd + S) para salvar. 

---

## 3. Como RE-IMPLANTAR (Importante!!!)

Sempre que você altera o código, precisa "Gerenciar Implantações" para o Endpoint ser atualizado, ou o React continuará batendo na versão velha.

1. No canto superior direito, clique em **Implantar** > **Gerenciar implantações**.
2. Clique no ícone de lápis (Editar) na sua implantação atual.
3. No menu suspenso "Versão", troque para **Nova Versão**.
4. Cique em **Implantar**.
5. Se a URL mudar, lembre de colocar no App (geralmente não muda).

Pronto! Agora quando você clicar em "Novo Ativo" no App, ele enviará lá pro sheet e sincronizará automaticamente.

