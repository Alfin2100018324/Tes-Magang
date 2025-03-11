document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".content");
    const baseUrl = "http://192.168.1.201:5003/";
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7InVzZXJfaWQiOjEsInVzZXJuYW1lIjoiam9rbyIsImZ1bGxuYW1lIjoiSm9rbyBNdW5hbmRhciIsInBhc3N3b3JkIjoiJDJhJDA2JDBZMnhtOFA3MjZpSUNjLmhRSVEwMWVlRldNQkpXOUpiYVB0QkZRdEFsbnE0OFVaOWdmeWdlIiwiZ3JvdXBfaWQiOjEsIm5payI6IiIsImFjdGl2ZSI6InllcyJ9LCJjcmVhdGVUaW1lIjoxNzQxNjc0MzgzfQ.SN6dMYHnZ8u6AiWq2QkbNfiyWJzV19j2Rx6IrL8itZE";

    function showSection(sectionId) {
        sections.forEach((section) => section.classList.remove("active"));
        document.getElementById(sectionId).classList.add("active");
    }

    document.getElementById("create").addEventListener("click", function () {
        showSection("create-section");
    });

    document.getElementById("read").addEventListener("click", function () {
        showSection("read-section");
        fetchGroups();
    });

    document.getElementById("update").addEventListener("click", function () {
        showSection("update-section");
    });

    document.getElementById("delete").addEventListener("click", function () {
        showSection("delete-section");
    });

    document.getElementById("getbyid").addEventListener("click", function () {
        showSection("getbyid-section");
    });

    document.getElementById("logout").addEventListener("click", function () {
        alert("Logged out successfully!");
        window.location.href = "login.html";
    });

    document.getElementById("create-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const groupData = {
            group_id: parseInt(document.getElementById("group_id").value),
            group_name: document.getElementById("group_name").value,
            active: document.getElementById("active").value
        };

        try {
            const response = await fetch(`${baseUrl}/api/group/add`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(groupData)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Group created successfully!");
                console.log("Success:", result);
            } else {
                alert("Failed to create group: " + JSON.stringify(result));
                console.error("Error:", result);
            }
        } catch (error) {
            console.error("Request failed:", error);
            alert("An error occurred while creating the group.");
        }
    });

    document.getElementById("getbyid-form").addEventListener("submit", async function (event) {
        event.preventDefault();
    
        const groupId = document.getElementById("getbyid_input").value;
    
        if (!groupId) {
            alert("Please enter a valid Group ID");
            return;
        }
    
        try {
            const response = await fetch(`${baseUrl}/api/group/${groupId}`, {
                method: "POST", 
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: parseInt(groupId) }) 
            });
    
            const data = await response.json();
    
            if (response.ok) {
                document.getElementById("getbyid-result").innerHTML = `
                    <pre>${JSON.stringify(data.response.data, null, 2)}</pre>
                `;
            } else {
                alert(`Error: ${data.metaData.message || "Failed to fetch data"}`);
            }
        } catch (error) {
            console.error("Error fetching group by ID:", error);
            alert("An error occurred while fetching the group.");
        }
    });        

    async function fetchGroups() {
        const payload = { id: "", name: "", active: "" };
    
        try {
            const response = await fetch(`${baseUrl}/api/group/list?p=1`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
    
            const data = await response.json();
            if (response.ok) {
                const tableBody = document.querySelector("#group-table tbody");
                tableBody.innerHTML = ''; 
    
                data.response.data.forEach(group => {
                    const row = document.createElement("tr");
    
                    const groupIdCell = document.createElement("td");
                    groupIdCell.textContent = group.group_id;
                    row.appendChild(groupIdCell);
    
                    const groupNameCell = document.createElement("td");
                    groupNameCell.textContent = group.group_name;
                    row.appendChild(groupNameCell);
    
                    const activeCell = document.createElement("td");
                    activeCell.textContent = group.active;
                    row.appendChild(activeCell);
    
                    tableBody.appendChild(row);
                });
            } else {
                alert("Failed to fetch groups: " + JSON.stringify(data));
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    }    
    
    document.getElementById("update-form").addEventListener("submit", async function (event) {
        event.preventDefault();
    
        const groupData = {
            group_id: parseInt(document.getElementById("edit_group_id").value),
            group_name: document.getElementById("edit_group_name").value,
            active: document.getElementById("edit_active").value
        };
    
        try {
            const response = await fetch(`${baseUrl}/api/group/edit`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(groupData)
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("Group updated successfully!");
                console.log("Success:", result);
            } else {
                alert("Failed to update group: " + JSON.stringify(result));
                console.error("Error:", result);
            }
        } catch (error) {
            console.error("Request failed:", error);
            alert("An error occurred while updating the group.");
        }
    });

    document.getElementById("delete-form").addEventListener("submit", async function (event) {
        event.preventDefault();
    
        const groupId = document.getElementById("delete_group_id").value;
    
        if (!groupId) {
            alert("Please enter a valid Group ID");
            return;
        }
    
        try {
            const response = await fetch(`${baseUrl}/api/group/delete`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ group_id: parseInt(groupId) })
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("Group deleted successfully!");
                console.log("Success:", result);
            } else {
                alert("Failed to delete group: " + JSON.stringify(result));
                console.error("Error:", result);
            }
        } catch (error) {
            console.error("Request failed:", error);
            alert("An error occurred while deleting the group.");
        }
    });
    
});


