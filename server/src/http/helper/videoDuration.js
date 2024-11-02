export function iso8601toString(duration) {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);

    const hours = matches[1] || 0;
    const minutes = matches[2] || 0;
    const seconds = matches[3] || 0;

    return `${hours ? hours + ":" : ""}${String(minutes).padStart(
        2,
        "0"
    )}:${String(seconds).padStart(2, "0")}`;
}

export function iso8601ToSeconds(duration) {
    // Expression régulière pour extraire les heures, minutes et secondes
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);

    // Convertir chaque partie en nombre de secondes
    const hours = parseInt(matches[1] || 0, 10);
    const minutes = parseInt(matches[2] || 0, 10);
    const seconds = parseInt(matches[3] || 0, 10);

    // Calculer le total en secondes
    return hours * 3600 + minutes * 60 + seconds;
}
