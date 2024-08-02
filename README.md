# **Introduzione**
**Progetto Settimanale Spotify - Build Week 2**

Questo progetto è un clone di Spotify, con un'interfaccia semplificata per la navigazione della musica, la visualizzazione degli album e l'esplorazione degli artisti. Include quattro pagine principali: Login, Home, Album e Artista.

## **Indice**
- [**Funzionalità**](#funzionalità)
- [**Tecnologie Utilizzate**](#tecnologie-utilizzate)
- [**Pagine**](#pagine)
- [**Caratteristiche**](#caratteristiche)
- [**Installazione**](#installazione)
- [**Utilizzo**](#utilizzo)
- [**Features Interessanti**](#features-interessanti)
- [**Licenza**](#licenza)

### **Funzionalità**
- **Interfaccia intuitiva.**
- **Funzione "search" che porta alla relativa pagina del proprio album/artista preferito.**
- **Cronologia delle ricerche.**
- **Sezione Hero centrale con brani random suggeriti all'utente, comprensiva di tasto play per ascoltare una demo del brano.**
- **Card con brani e album proposti, ognuna con relativo tasto play.**
- **Player audio con possibilità di regolazione del volume, informazioni sulla durata corrente e totale del brano, e controlli per andare a un punto specifico del brano. Pulsanti disponibili: mute/unmute, previous/next, repeat e shuffle.**

### **Tecnologie Utilizzate**
- **HTML** – per la creazione e l’impaginazione delle pagine.
- **Bootstrap** - framework CSS per il design responsive delle pagine.
- **SASS** - per l'implementazione dello style personalizzato a quello di Bootstrap.
- **JavaScript** - per l’interattività con gli oggetti del DOM.
- **API di Deezer** - per recuperare dati relativi ad album e artisti.
- **Local Storage** - per salvare la cronologia delle ricerche e altre informazioni temporanee.

### **Pagine**
Il clone di Spotify è composto da 4 pagine:

1. **Login_Page** - La pagina che consente agli utenti di inserire le proprie credenziali, come email e password, per accedere.
2. **Home_Page** - Pagina principale dopo l'accesso, dove trovi canzoni suggerite in modo casuale all'utente, e puoi navigare verso la sezione artisti (cliccando l'immagine dell'artista) e album (cliccando l'immagine dell'album).
3. **Album_Page** - Visualizza i dettagli di un album, inclusa l'immagine di copertina, il nome dell'artista e l'elenco delle canzoni di quell'album.
4. **Artist_Page** - Fornisce informazioni su un artista specifico, inclusi tutti i suoi album e i brani più venduti.

### **Caratteristiche**
- **Ricerca Avanzata**: La funzione di ricerca permette di trovare album e artisti facilmente. I risultati sono visualizzati in tempo reale e l'utente può accedere direttamente alla pagina dell'album o dell'artista desiderato.
- **Gestione Cronologia**: La cronologia delle ricerche è salvata nel Local Storage e visualizzata in una sezione dedicata, permettendo all'utente di accedere rapidamente alle ricerche precedenti.
- **Suggerimenti Personalizzati**: La sezione Hero propone brani e album basati su suggerimenti casuali, aiutando l'utente a scoprire nuova musica.
- **Player Audio Completo**: Include controlli per regolare il volume, mute/unmute, saltare ai brani precedenti o successivi, ripetere e mescolare i brani. Mostra la durata totale e corrente del brano e permette di navigare in punti specifici della traccia.
- **Design Responsive**: Utilizza Bootstrap e SASS per garantire che l'applicazione sia visualizzabile su dispositivi di diverse dimensioni, offrendo un'esperienza utente ottimale sia su desktop che su dispositivi mobili.

### **Installazione**
Per eseguire il progetto localmente, segui questi passaggi:

```bash
# Clona il repository
git clone https://github.com/enzocesarano/BuildWeek2-Team1.git

# Entra nella cartella del progetto
cd BuildWeek2-Team1

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm start
```
### **Utilizzo**
1. **Login**: Accedi con le tue credenziali (email e password) sulla pagina di login.
2. **Home**: Dopo il login, esplora la pagina principale per scoprire brani suggeriti casualmente. Usa la funzione di ricerca per trovare album o artisti.
3. **Album**: Accedi alla pagina dell'album per visualizzare dettagli come l'immagine di copertura, il nome dell'artista e l'elenco delle canzoni.
4. **Artista**: Visita la pagina dell'artista per vedere tutti gli album e i brani più popolari dell'artista.

### **Features Interessanti**
- **Scopri Nuova Musica**: La funzione di suggerimenti casuali nella sezione Hero e nelle card di brani e album aiuta a scoprire nuova musica.
- **Interazione Completa con il Player Audio**: Il player audio offre un'esperienza di ascolto completa con controlli avanzati e la possibilità di navigare nella traccia.
- **Salvataggio della Cronologia delle Ricerche**: Grazie al Local Storage, puoi accedere rapidamente alle tue ricerche passate.

### **Licenza**
Questo progetto è concesso in licenza sotto la Licenza MIT.
