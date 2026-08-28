class SharedHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
          <div class="header">
            <h1>Reynaldo Diego Benavidez</h1>
            <h2>Senior Software Engineer</h2>
    
            <!-- The button element with an explicit action type and ID for JavaScript targeting -->
            <button id="theme-toggle" type="button" aria-label="Toggle color theme">
                Toggle Theme
            </button>
        </div>
  
        <nav class="nav_bar">
        <!-- <div class="nav_logo">My Website</div> -->
        <ul class="nav_links">
            <li title="page_link"><a href="../index.html">Home</a></li>
            <li title="page_link"><a href="blog.html">Blog</a></li>
            <li title="page_link"><a href="resume.html">Resume</a></li>
            <li title="page_link"><a href="projects.html">Software Projects</a></li>
            <li title="page_link"><a href="hobby_projects.html">Hobby Projects</a></li>
            <li title="page_link"><a href="about.html">About</a></li>
            <!-- TODO: Add a link to my github page. -->
            <!-- TODO: Add a link to my linkedin page. -->
            <!-- TODO: Add a way to contact me using a popup/modal. -->
        </ul>
        </nav>
        `;
    }
}
customElements.define('shared-header', SharedHeader)