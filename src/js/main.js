document.querySelectorAll('.sidebar ul li a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelectorAll('.sidebar ul li a').forEach(a => a.classList.remove('active'));
        document.querySelectorAll('.tabcontent').forEach(tab => tab.classList.remove('active'));
        link.classList.add('active');
        const target = document.querySelector(link.getAttribute('href'));
        target.classList.add('active');

        // Tải dữ liệu khi nhấp vào các mục trên thanh điều hướng
        if (link.getAttribute('href') === '#providers') {
            loadProviders();
        } else if (link.getAttribute('href') === '#users') {
            loadUsers();
        } else if (link.getAttribute('href') === '#reports') {
            loadReports();
        }
    });
});

const apiUrl = {
    providers: 'http://localhost:3000/providers',
    users: 'http://localhost:3000/users',
    reports: 'http://localhost:3000/reports'
};

function loadProviders() {
    fetch(apiUrl.providers)
        .then(response => response.json())
        .then(data => {
            const providersBody = document.getElementById('providers-body');
            providersBody.innerHTML = data.map(provider => `
            <tr>
                <td>${provider.id}</td>
                <td>${provider.name}</td>
                <td>${provider.location}</td>
                <td>${provider.services.map(service => service.service_name).join(', ')}</td>
                <td><button onclick="viewProvider(${provider.id})">View Details</button></td>
            </tr>
        `).join('');
        })
        .catch(error => console.error('Error loading providers:', error));
}

function viewProvider(providerId) {
    fetch(`${apiUrl.providers}/${providerId}`)
        .then(response => response.json())
        .then(provider => {
                const providerDetails = document.getElementById('provider-details');
                providerDetails.innerHTML = `
            <h3>${provider.name}</h3>
            <p>Location: ${provider.location}</p>
            <p>Cost: ${provider.cost}</p>
            <h4>Services</h4>
            <ul>
                ${provider.services.map(service => `
                    <li>
                        <strong>Service Name:</strong> ${service.service_name}<br>
                        <strong>Vehicle of Service:</strong> ${service.vehicle_of_service}<br>
                        <strong>Procedure:</strong> ${service.procedure}<br>
                        <strong>Cost:</strong> ${service.cost}
                    </li>
                `).join('')}
            </ul>
            <button onclick="hideProviderDetails()">Close</button>
        `;
      providerDetails.classList.remove('hidden');
      // Ẩn bảng danh sách
      document.getElementById('providers-table').classList.add('hidden');
    })
    .catch(error => console.error('Error loading provider details:', error));
}

function hideProviderDetails() {
  document.getElementById('provider-details').classList.add('hidden');

  // Hiển thị lại bảng danh sách
  document.getElementById('providers-table').classList.remove('hidden');
}

function loadUsers() {
  fetch(apiUrl.users)
    .then(response => response.json())
    .then(data => {
      const usersBody = document.getElementById('users-body');
      usersBody.innerHTML = data.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.signup_date}</td>
                <td><button onclick="viewUserDetails(${user.id})">View Details</button></td>
            </tr>
        `).join('');
    })
    .catch(error => console.error('Error loading users:', error));
}

function viewUserDetails(userId) {
  fetch(`${apiUrl.users}/${userId}`)
    .then(response => response.json())
    .then(user => {
      const userDetails = document.getElementById('user-details');
      userDetails.innerHTML = `
            <h3>User Details</h3>
            <p>ID: ${user.id}</p>
            <p>Name: ${user.name}</p>
            <p>Date of birth: ${user.date_of_birth}</p>
            <p>Email: ${user.email}</p>
            <p>Phone: ${user.phone}</p>
            <p>Location: ${user.location}</p>
            <p>Sign up date: ${user.signup_date}</p>
            <button onclick="hideUserDetails()">Close</button>
        `;
      userDetails.classList.remove('hidden');
      // Ẩn bảng danh sách
      document.getElementById('users-table').classList.add('hidden');
    })
    .catch(error => console.error('Error loading user details:', error));
}

function hideUserDetails() {
  document.getElementById('user-details').classList.add('hidden');

  // Hiển thị lại bảng danh sách
  document.getElementById('users-table').classList.remove('hidden');
}

function loadReports() {
  fetch(apiUrl.reports)
    .then(response => response.json())
    .then(data => {
      const reportsBody = document.getElementById('reports-body');
      reportsBody.innerHTML = data.map(report => `
            <tr id="report-${report.id}">
                <td>${report.id}</td>
                <td>${report.userName}</td>
                <td>${report.content}</td>
                <td class="report-status">${report.status}</td>
                <td><button onclick="viewReport(${report.id})">View Details</button></td>
            </tr>
        `).join('');
    })
    .catch(error => console.error('Error loading reports:', error));
}

function viewReport(reportId) {
  fetch(`${apiUrl.reports}/${reportId}`)
    .then(response => response.json())
    .then(report => {
      const reportDetails = document.getElementById('report-details');
      reportDetails.innerHTML = `
            <h3>Report by ${report.userName}</h3>
            <p>${report.content}</p>
            <p>Status: ${report.status}</p>
            <button onclick="acceptReport(${report.id})">Accept</button>
            <button onclick="declineReport(${report.id})">Decline</button>
            <button onclick="hideReportDetails()">Close</button>
        `;
      reportDetails.classList.remove('hidden');
      // Ẩn bảng danh sách
      document.getElementById('reports-table').classList.add('hidden');
    })
    .catch(error => console.error('Error loading report details:', error));
}

function showReportsTab() {
  document.querySelectorAll('.sidebar ul li a').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('.tabcontent').forEach(tab => tab.classList.remove('active'));
  document.querySelector('.sidebar ul li a[href="#reports"]').classList.add('active');
  document.querySelector('#reports').classList.add('active');
}

function acceptReport(reportId) {
  fetch(`${apiUrl.reports}/${reportId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'Accepted' })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to accept report');
      }
      document.querySelector(`#report-${reportId} .report-status`).textContent = 'Accepted';
      hideReportDetails();
      showSuccessModal(); // Hiển thị thông báo thành công
    })
    .catch(error => console.error('Error accepting report:', error));
}

function declineReport(reportId) {
  fetch(`${apiUrl.reports}/${reportId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'Declined' })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to decline report');
      }
      document.querySelector(`#report-${reportId} .report-status`).textContent = 'Declined';
      hideReportDetails();
      showSuccessModal(); // Hiển thị thông báo thành công
    })
    .catch(error => console.error('Error declining report:', error));
}

function showSuccessModal() {
  document.querySelector('.modal-update-repost').classList.add('success-modal');

  setTimeout(() => {
    document.querySelector('.modal-update-repost').classList.remove('success-modal');
  }, 2000); // Ẩn modal sau 2 giây
}

// Đóng modal khi nhấp vào nút đóng
document.querySelector('.close').addEventListener('click', function () {
  document.querySelector('.modal-update-repost').classList.remove('success-modal');
});

function hideReportDetails() {
  document.getElementById('report-details').classList.add('hidden');

  // Hiển thị lại bảng danh sách
  document.getElementById('reports-table').classList.remove('hidden');

}