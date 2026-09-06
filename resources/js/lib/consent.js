import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'rck_cookie_consent';

/*
 * Petit magasin partage entre le bandeau cookies et le bouton WhatsApp.
 *
 * Le bandeau occupe le bas de l'ecran ; le bouton doit se decaler tant
 * qu'il est affiche, sinon il recouvre les boutons d'acceptation. Passer
 * par un etat React plutot que par une variable CSS garantit que le
 * deplacement suit reellement le rendu.
 */
let choice = null;
let hydrated = false;
const listeners = new Set();

function read() {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        // Navigation privee ou stockage bloque : on considere non repondu.
        return null;
    }
}

function notify() {
    listeners.forEach((listener) => listener());
}

function subscribe(listener) {
    listeners.add(listener);

    return () => listeners.delete(listener);
}

function getSnapshot() {
    if (!hydrated) {
        choice = read();
        hydrated = true;
    }

    return choice;
}

export function setConsent(value) {
    try {
        localStorage.setItem(STORAGE_KEY, value);
    } catch {
        // Le choix ne survivra pas au rechargement, mais l'interface suit.
    }

    choice = value;
    hydrated = true;
    notify();
}

/**
 * true tant que le visiteur n'a pas repondu au bandeau.
 */
export function useCookieBannerVisible() {
    // Au premier rendu serveur/client on suppose repondu, pour eviter que le
    // bandeau clignote avant la lecture du stockage.
    const value = useSyncExternalStore(subscribe, getSnapshot, () => 'ssr');

    return value === null;
}
