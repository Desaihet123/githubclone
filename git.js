 const button = document.getElementById("btn");
    const repositoriesbtn = document.getElementById("repobtn");
    const carddiv = document.getElementById("card");
    const repodiv = document.getElementById("repositoriesdata");

    repositoriesbtn.style.display = "none";
    let cachedRepos = [];

    button.addEventListener("click", function () {
      details();
    });

    repositoriesbtn.addEventListener("click", function () {
      if (cachedRepos.length === 0) {
        repodiv.innerHTML = `<p>No public repositories</p>`;
        return;
      }

      repodiv.innerHTML = `
        <h3>Public Repositories (${cachedRepos.length})</h3>
        ${cachedRepos
          .map(
            (repo) =>
              `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`
          )
          .join("")}
      `;
    });

    function details() {
      async function result() {
        const username = document.getElementById("name").value.trim();
        repodiv.innerHTML = "";
        carddiv.innerHTML = "";

        try {
          const response = await fetch(
            `https://api.github.com/users/${username}`
          );
          const data = await response.json();

          if (data.message === "Not Found") {
            carddiv.innerHTML = `<p>User not found</p>`;
            repositoriesbtn.style.display = "none";
            return;
          }

          const followersRes = await fetch(data.followers_url);
          const followers = await followersRes.json();

          const followingUrl = data.following_url.replace("{/other_user}", "");
          const followingRes = await fetch(followingUrl);
          const followings = await followingRes.json();

          const reposRes = await fetch(data.repos_url);
          cachedRepos = await reposRes.json();

          const createdAt = new Date(data.created_at).toLocaleDateString();

          carddiv.innerHTML = `
            <img src="${data.avatar_url}" alt="Avatar" width="100" />
            <h2>${data.name || "No name available"} (${data.login})</h2>
            <p><strong>Account Created:</strong> ${createdAt}</p>

            <h3>Followers (${followers.length})</h3>
            <ul>${followers
              .map((f) => `<li>${f.login}</li>`)
              .join("")}</ul>

            <h3>Following (${followings.length})</h3>
            <ul>${followings
              .map((f) => `<li>${f.login}</li>`)
              .join("")}</ul>
          `;

          repositoriesbtn.style.display = "inline-block";
        } catch (error) {
          console.error("Error detected:", error);
          carddiv.innerHTML = `<p>Error fetching user data</p>`;
        }
      }

      result();
    }