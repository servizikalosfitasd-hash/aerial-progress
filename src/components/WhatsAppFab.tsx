const WHATSAPP_URL = "https://wa.me/3465337431";

export default function WhatsAppFab() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 group">
      <span
        className="pointer-events-none select-none whitespace-nowrap rounded-full bg-card/95 backdrop-blur-md border border-border px-4 py-2 text-sm font-medium text-foreground shadow-elevated opacity-0 translate-x-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0"
        role="tooltip"
      >
        Scrivici per info o assistenza
      </span>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Scrivici su WhatsApp per info o assistenza"
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-elevated transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{ backgroundColor: "#25D366" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-7 w-7"
          fill="white"
          aria-hidden="true"
        >
          <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.916 3.41 4.94 4.398.616.302 2.232.93 2.917.93.515 0 2.59-.4 2.59-1.876 0-.04 0-.114-.03-.143-.077-.158-2.273-1.146-2.617-1.146Zm-2.92 7.062c-1.55 0-3.064-.42-4.382-1.218l-3.064.99 1.003-2.964a8.288 8.288 0 0 1-1.404-4.616c0-4.59 3.745-8.337 8.336-8.337 4.59 0 8.336 3.746 8.336 8.337 0 4.59-3.745 8.336-8.336 8.336Zm0-18.318c-5.495 0-9.982 4.488-9.982 9.982 0 1.733.444 3.466 1.318 4.998L5.598 26.5l5.776-1.876a10.057 10.057 0 0 0 4.806 1.218c5.494 0 9.98-4.487 9.98-9.982 0-5.494-4.486-9.982-9.98-9.982Z" />
        </svg>
      </a>
    </div>
  );
}
