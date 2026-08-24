const fs = require("fs");
const path = require("path");

// =====================================================
// CONFIGURAÇÃO
// =====================================================

const ROOT = __dirname;

const ASSETS_DIR = path.join(ROOT, "assets");

const OUTPUT_FILE = path.join(ROOT, "galerias.js");

const GALLERIES = {
  casos: path.join(ASSETS_DIR, "casos"),
  antesdepois: path.join(ASSETS_DIR, "antesdepois"),
  nossaclinica: path.join(ASSETS_DIR, "nossaclinica"),
};

// Extensões aceitas
const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
];

// =====================================================
// FUNÇÕES
// =====================================================

function isImage(fileName) {
  const extension = path.extname(fileName).toLowerCase();

  return IMAGE_EXTENSIONS.includes(extension);
}


// Ordenação natural:
//
// caso1
// caso2
// caso10
//
// em vez de:
//
// caso1
// caso10
// caso2
//
function naturalSort(a, b) {
  return a.localeCompare(
    b,
    "pt-BR",
    {
      numeric: true,
      sensitivity: "base",
    }
  );
}


// =====================================================
// LÊ UMA GALERIA
// =====================================================

function readGallery(galleryName, folderPath) {

  // Caso a pasta não exista
  if (!fs.existsSync(folderPath)) {

    console.warn(
      `⚠ Pasta não encontrada: assets/${galleryName}`
    );

    return [];
  }


  const files = fs
    .readdirSync(folderPath)
    .filter((file) => {

      const fullPath =
        path.join(folderPath, file);


      // Ignora pastas internas
      if (!fs.statSync(fullPath).isFile()) {
        return false;
      }


      // Aceita somente imagens
      return isImage(file);

    })
    .sort(naturalSort);


  // Converte para caminho usado pelo navegador
  return files.map((file) => {

    return `./assets/${galleryName}/${file}`;

  });
}


// =====================================================
// GERA GALERIAS
// =====================================================

function generateGalleries() {

  console.log("");
  console.log("======================================");
  console.log("  Dra. Cinthia - Gerador de Galerias");
  console.log("======================================");
  console.log("");


  const galleries = {};


  Object.entries(GALLERIES)
    .forEach(([galleryName, folderPath]) => {

      galleries[galleryName] =
        readGallery(
          galleryName,
          folderPath
        );


      console.log(
        `✓ ${galleryName}: ${galleries[galleryName].length} imagem(ns)`
      );

    });


  // ===================================================
  // CRIA O CONTEÚDO DO galerias.js
  // ===================================================

  const output = `
// =====================================================
// ARQUIVO GERADO AUTOMATICAMENTE
//
// NÃO EDITE ESTE ARQUIVO MANUALMENTE.
//
// Para atualizar as galerias:
// node gerar-galerias.js
// =====================================================

window.GALERIAS = ${JSON.stringify(
    galleries,
    null,
    2
  )};
`.trimStart();


  // ===================================================
  // SALVA
  // ===================================================

  fs.writeFileSync(
    OUTPUT_FILE,
    output,
    "utf8"
  );


  console.log("");
  console.log("✓ galerias.js atualizado com sucesso.");
  console.log("");

}


// =====================================================
// EXECUTA
// =====================================================

try {

  generateGalleries();

} catch (error) {

  console.error("");
  console.error(
    "❌ Erro ao gerar galerias:"
  );

  console.error(error);

  process.exit(1);

}