export function getStatus(status) {
    if(status === "pending") return "in approvazione";
    if(status === "accepted") return "confermato";
    if(status === "rejected") return "rifiutato";
}

export default getStatus;