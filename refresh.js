function checkRefreshStatus() {
    fetch('/api/refresh-status')
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            if (data.restarted) {
                console.log("Server was restarted. Refreshing the page...");
                location.reload();
            }
        })
        .catch(error => console.error('Error checking refresh status:', error));
}
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    setInterval(checkRefreshStatus, 1000);
}

