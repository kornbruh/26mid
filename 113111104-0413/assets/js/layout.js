(async function () {
  const currentPath = window.location.pathname;

  const pageTypeMap = {
    "/pages/home.html": "home",

    "/pages/about.html": "mid",
    "/pages/1.html": "mid",
    "/pages/2.html": "mid",
    "/pages/3.html": "mid",

    "/pages/contact.html": "final",
    "/pages/4.html": "final",
    "/pages/5.html": "final",
    "/pages/6.html": "final"
  };

  const currentPageType = pageTypeMap[currentPath] || "home";

  const titleText = document.title || "未命名頁面";
  const breadcrumbMeta = document.querySelector('meta[name="breadcrumb"]');
  const breadcrumbText = breadcrumbMeta ? breadcrumbMeta.content : "";

  const contentTemplate = document.getElementById("content");
  const pageContentHtml = contentTemplate ? contentTemplate.innerHTML : "<p>找不到頁面內容</p>";

  try {
    const res = await fetch("/layouts/master.html");
    const masterHtml = await res.text();

    const parser = new DOMParser();
    const masterDoc = parser.parseFromString(masterHtml, "text/html");

    masterDoc.title = titleText;

    const contentContainer = masterDoc.getElementById("page-content");
    if (contentContainer) {
      contentContainer.innerHTML = pageContentHtml;
    }

    const breadcrumb = masterDoc.getElementById("breadcrumb");
    if (breadcrumb) {
      breadcrumb.textContent = breadcrumbText;
    }

    const year = masterDoc.getElementById("year");
    if (year) {
      year.textContent = new Date().getFullYear();
    }

    const sidebar = masterDoc.getElementById("sidebar");
    const midMenu = masterDoc.getElementById("mid-menu");
    const finalMenu = masterDoc.getElementById("final-menu");

    if (currentPageType === "home") {
      if (sidebar) sidebar.style.display = "none";
    } else if (currentPageType === "mid") {
      if (sidebar) sidebar.style.display = "block";
      if (midMenu) midMenu.style.display = "block";
      if (finalMenu) finalMenu.style.display = "none";
    } else if (currentPageType === "final") {
      if (sidebar) sidebar.style.display = "block";
      if (midMenu) midMenu.style.display = "none";
      if (finalMenu) finalMenu.style.display = "block";
    }

    const allLinks = masterDoc.querySelectorAll("a[href]");
    allLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentPath) {
        link.classList.add("active");
      }
    });

    document.documentElement.replaceWith(masterDoc.documentElement);
  } catch (err) {
    console.error("載入 master.html 失敗：", err);
    document.body.innerHTML = "<h1>Layout 載入失敗</h1>";
  }
})();
