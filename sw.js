/**
 * Service worker: é o que faz a calculadora abrir sem internet.
 *
 * Estratégia: rede primeiro, cache como rede de segurança.
 * A página é pequena, então buscar na rede é rápido quando há sinal — e
 * garante que uma correção publicada chegue já na primeira abertura. Sem
 * sinal, cai para a última cópia guardada e o técnico continua atendendo.
 *
 * Ao mexer nos arquivos, suba a versão: é o que descarta o cache antigo.
 */
const VERSAO = "calc-v4";

const ESSENCIAIS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icone-192.png",
  "./icone-512.png",
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches
      .open(VERSAO)
      .then((cache) => cache.addAll(ESSENCIAIS))
      // assume o controle sem esperar a aba antiga fechar
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(
          chaves.filter((c) => c !== VERSAO).map((c) => caches.delete(c))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evento) => {
  const req = evento.request;

  // só GET entra no cache; o resto passa direto
  if (req.method !== "GET" || !req.url.startsWith("http")) return;

  evento.respondWith(
    fetch(req)
      .then((resposta) => {
        // guarda uma cópia para a próxima vez que faltar sinal
        if (resposta && resposta.status === 200 && resposta.type === "basic") {
          const copia = resposta.clone();
          caches.open(VERSAO).then((cache) => cache.put(req, copia));
        }
        return resposta;
      })
      .catch(() =>
        caches
          .match(req)
          .then((guardada) => guardada || caches.match("./index.html"))
      )
  );
});
