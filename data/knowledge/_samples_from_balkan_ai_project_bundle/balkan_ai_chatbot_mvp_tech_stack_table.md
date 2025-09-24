# Balkan AI Chatbot MVP – Tech Stack Overview

## Glavni Tehnološki Stack

| Komponenta   | Stack/Tool                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | Next.js (Vercel deploy) – Moderan React framework s ugrađenim SSR-om za brz, SEO-friendly web i mobilni pristup.        |
| **UI kit**   | shadcn/ui + Tailwind CSS – Modularna komponentna biblioteka + utility-first CSS za brzu i fleksibilnu izradu UI-a.      |
| **AI model** | Google Gemini (free/premium) + fallback: GPT-4 mini – Najnoviji multimodalni LLM-ovi, optimizirani za BS/HR/SR regiju.  |
| **Emotion**  | Hume AI API (production-ready) – Automatska analiza emocija iz slika za interaktivne i viralne funkcionalnosti.         |
| **Auth**     | Dodati auth (npr. Supabase Auth) po potrebi – Prijava korisnika, personalizirani podaci, sigurni pristup funkcijama.    |
| **DB**       | Supabase (user data, logs, napredne funkcije) – Skalabilna Postgres baza za analitiku, korisnike i buduće featurke.     |
| **I18n**     | Next.js i18n (EN + BS paket, centralizirano) – Sve prevode drži na jednom mjestu; korisnik bira jezik u par klikova.     |
| **Hosting**  | Vercel (free tier, custom domain ready) – Brzi deploy, automatski SSL, skalabilnost za EU/Balkan projekte.              |
| **Design**   | DBZ (Dragon Ball Z) x Balkan, animacije, meme, Orbitron/Roboto font – Dinamična tema, humor i lokalni karakter.         |

---

## Opis i Prednosti Stacka

Ovaj MVP tehnološki stack daje idealan balans između brzine, fleksibilnosti i minimalnih troškova, posebno skrojen za balkansko tržište i brzi izlazak na tržište. Next.js omogućava naprednu arhitekturu i jednostavan razvoj, dok shadcn/ui i Tailwind CSS značajno ubrzavaju razvoj responsivnog i modernog korisničkog interfejsa.

Google Gemini osigurava moćnu AI obradu teksta, slike i zvuka, a GPT-4 mini je automatska rezerva za maksimalnu pouzdanost. Hume AI API već funkcioniše u produkciji, omogućujući popularne featurke poput "DBZ power level" skenera emocija i "Hot-or-Not" analize atraktivnosti. Supabase je preporučena baza podataka za korisničke informacije, praćenje aktivnosti i naprednu analitiku, uz mogućnost dodavanja autentifikacije kad to bude potrebno.

Sve komponente hostaju se na Vercelu zbog minimalnih troškova i izuzetno brzog deploya. Vizualni identitet spaja Dragon Ball Z estetiku s prepoznatljivim balkanskim šmekom i humorom, nudeći originalno korisničko iskustvo. Next.js i18n omogućava centralizovano upravljanje prevodima i olakšava internacionalizaciju, čineći aplikaciju dostupnom korisnicima iz cijele regije.

---

**Ovaj stack je spreman za brzu iteraciju i lako proširenje, uz potpunu modularnost i sigurnu skalabilnost.**

