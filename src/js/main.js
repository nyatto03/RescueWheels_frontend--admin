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
            <button onclick="deleteProvider(${provider.id})">Delete</button>
        `;
      providerDetails.classList.remove('hidden');
      // Ẩn bảng danh sách
      document.getElementById('providers-table').classList.add('hidden');

      document.getElementById('searchProviderContainer').style.display = 'none';
    })
    .catch(error => console.error('Error loading provider details:', error));
}

function hideProviderDetails() {
  document.getElementById('provider-details').classList.add('hidden');

  // Hiển thị lại bảng danh sách
  document.getElementById('providers-table').classList.remove('hidden');

  document.getElementById('searchProviderContainer').style.display = '';
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
            <button onclick="deleteUser(${user.id})">Delete</button>
        `;
      userDetails.classList.remove('hidden');
      // Ẩn bảng danh sách
      document.getElementById('users-table').classList.add('hidden');

      document.getElementById('searchUserContainer').style.display = 'none';

    })
    .catch(error => console.error('Error loading user details:', error));
}

function hideUserDetails() {
  document.getElementById('user-details').classList.add('hidden');

  // Hiển thị lại bảng danh sách
  document.getElementById('users-table').classList.remove('hidden');

  document.getElementById('searchUserContainer').style.display = '';
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
            <button onclick="deleteReport(${report.id})">Delete</button>
        `;
      reportDetails.classList.remove('hidden');
      // Ẩn bảng danh sách
      document.getElementById('reports-table').classList.add('hidden');

      document.getElementById('searchReportContainer').style.display = 'none';
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
      showupdateStatusReportshowSuccessModal(); // Hiển thị thông báo thành công
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
      showupdateStatusReportshowSuccessModal(); // Hiển thị thông báo thành công
    })
    .catch(error => console.error('Error declining report:', error));
}

function showupdateStatusReportshowSuccessModal() {
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

  document.getElementById('searchReportContainer').style.display = '';

}

// Thêm sự kiện cho nút tìm kiếm
document.getElementById('searchProviderButton').addEventListener('click', function () {
  searchProviders();
});

// Thêm sự kiện khi ấn phím Enter trong trường tìm kiếm
document.getElementById('searchProviderInput').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    searchProviders();
  }
});

// Hàm tìm kiếm nhà cung cấp
function searchProviders() {
  const searchText = document.getElementById('searchProviderInput').value.toLowerCase();
  const rows = document.getElementById('providers-table').querySelectorAll('tbody tr');

  rows.forEach(row => {
    const id = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
    const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
    const location = row.querySelector('td:nth-child(3)').textContent.toLowerCase();

    if (id.includes(searchText) || name.includes(searchText) || location.includes(searchText)) {
      row.style.display = ''; // Hiển thị hàng nếu chứa từ khóa tìm kiếm
    } else {
      row.style.display = 'none'; // Ẩn hàng nếu không chứa từ khóa tìm kiếm
    }
  });
}


// Thêm sự kiện cho nút tìm kiếm
document.getElementById('searchUserButton').addEventListener('click', function () {
  searchUsers();
});

// Thêm sự kiện khi ấn phím Enter trong trường tìm kiếm
document.getElementById('searchUserInput').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    searchUsers();
  }
});

// Hàm tìm kiếm người dùng
function searchUsers() {
  const searchText = document.getElementById('searchUserInput').value.toLowerCase();
  const rows = document.getElementById('users-table').querySelectorAll('tbody tr');

  rows.forEach(row => {
    const id = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
    const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
    const email = row.querySelector('td:nth-child(3)').textContent.toLowerCase();

    if (id.includes(searchText) || name.includes(searchText) || email.includes(searchText)) {
      row.style.display = ''; // Hiển thị hàng nếu chứa từ khóa tìm kiếm
    } else {
      row.style.display = 'none'; // Ẩn hàng nếu không chứa từ khóa tìm kiếm
    }
  });
}

// Thêm sự kiện cho nút tìm kiếm repost
document.getElementById('searchReportButton').addEventListener('click', function () {
  searchReports();
});

// Thêm sự kiện khi ấn phím Enter trong trường tìm kiếm repost
document.getElementById('searchReportInput').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    searchReports();
  }
});

// Function to search reports
function searchReports() {
  const searchText = document.getElementById('searchReportInput').value.toLowerCase();
  const rows = document.getElementById('reports-table').querySelectorAll('tbody tr');

  rows.forEach(row => {
    const id = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
    const userName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
    const status = row.querySelector('td:nth-child(4)').textContent.toLowerCase();

    if (id.includes(searchText) || userName.includes(searchText) || status.includes(searchText)) {
      row.style.display = ''; // Hiển thị hàng nếu chứa từ khóa tìm kiếm
    } else {
      row.style.display = 'none'; // Ẩn hàng nếu không chứa từ khóa tìm kiếm
    }
  });
}


//delete

function deleteProvider(providerId) {
  fetch(`${apiUrl.providers}/${providerId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete provider');
      }
      // Xóa hàng khỏi bảng sau khi xóa thành công
      hideProviderDetails();
      loadProviders();
      showdeleteProvidershowSuccessModal(); // Hiển thị thông báo thành công
      // Sau khi xóa thành công, tải lại danh sách nhà cung cấp
    })
    .catch(error => console.error('Error deleting provider:', error));
}


function showdeleteProvidershowSuccessModal() {
  document.querySelector('.modal-delete-provider').classList.add('success-modal');

  setTimeout(() => {
    document.querySelector('.modal-delete-provider').classList.remove('success-modal');
  }, 2000); // Ẩn modal sau 2 giây
}

// Đóng modal khi nhấp vào nút đóng
document.querySelector('.close').addEventListener('click', function () {
  document.querySelector('.modal-delete-provider').classList.remove('success-modal');
});

// Hàm xóa người dùng
function deleteUser(userId) {
  fetch(`${apiUrl.users}/${userId}`, {
      method: 'DELETE'
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to delete user');
      }

      hideUserDetails();
      loadUsers();
      showDeleteUserSuccessModal();
  })
  .catch(error => console.error('Error deleting user:', error));
}

// Hàm hiển thị modal thông báo xóa người dùng thành công
function showDeleteUserSuccessModal() {
  document.querySelector('.modal-delete-user').classList.add('success-modal');

  setTimeout(() => {
      document.querySelector('.modal-delete-user').classList.remove('success-modal');
  }, 2000); // Ẩn modal sau 2 giây
}

// Đóng modal khi nhấp vào nút đóng
document.querySelector('.modal-delete-user .close').addEventListener('click', function () {
  document.querySelector('.modal-delete-user').classList.remove('success-modal');
});

// Hàm xóa báo cáo
function deleteReport(reportId) {
  fetch(`${apiUrl.reports}/${reportId}`, {
      method: 'DELETE'
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to delete report');
      }
      hideReportDetails();
      loadReports();
      showDeleteReportSuccessModal();
  })
  .catch(error => console.error('Error deleting report:', error));
}

// Hàm hiển thị modal thông báo xóa báo cáo thành công
function showDeleteReportSuccessModal() {
  document.querySelector('.modal-delete-report').classList.add('success-modal');

  setTimeout(() => {
      document.querySelector('.modal-delete-report').classList.remove('success-modal');
  }, 2000); // Ẩn modal sau 2 giây
}

// Đóng modal khi nhấp vào nút đóng
document.querySelector('.modal-delete-report .close').addEventListener('click', function () {
  document.querySelector('.modal-delete-report').classList.remove('success-modal');
});