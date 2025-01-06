// Data Storage
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null;

// Helper Functions
const findUser = (account, password) => {
  console.log('Searching for user with account:', account, 'and password:', password);
  return users.find(user => 
    user.account.trim().toLowerCase() === account.trim().toLowerCase() && 
    user.password === password
  );
};

const updateCurrentUserSession = (user) => {
  sessionStorage.setItem('currentUser', JSON.stringify(user));
};

// Signup Functionality
document.getElementById('signup-form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('signup-name').value.trim();
  const account = document.getElementById('signup-acc').value.trim();
  const password = document.getElementById('signup-pass').value;

  if (users.some(user => user.account.trim().toLowerCase() === account.toLowerCase())) {
    alert('Account number already exists!');
  } else {
    const newUser = { name, account, password, balance: 0, transactions: [] };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users)); // Save updated users array
    alert('Account created successfully!');
    window.location.href = 'login.html';
  }
});

// Login Functionality
document.getElementById('login-form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const account = document.getElementById('login-acc').value.trim();
  const password = document.getElementById('login-pass').value;

  console.log('Login attempt with account:', account, 'and password:', password);

  const user = findUser(account, password);

  if (user) {
    updateCurrentUserSession(user); // Store current user in session storage
    alert('Login successful!');
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid account number or password!');
  }
});

// Dashboard Logic
if (window.location.pathname.includes('dashboard.html')) {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  if (currentUser) {
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-balance').textContent = `RS.${currentUser.balance}`;
  } else {
    alert('No user logged in!');
    window.location.href = 'login.html';
  }
}

// Deposit Functionality
document.getElementById('deposit-form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const account = document.getElementById('deposit-acc').value.trim();
  const password = document.getElementById('deposit-pass').value;
  const amount = parseFloat(document.getElementById('deposit-amt').value);

  console.log('Deposit attempt with account:', account, 'and password:', password, 'amount:', amount);

  const user = findUser(account, password);

  if (user) {
    if (amount > 0) {
      user.balance += amount;
      user.transactions.push({ type: 'Deposit', amount });
      localStorage.setItem('users', JSON.stringify(users)); // Update localStorage
      updateCurrentUserSession(user); // Update sessionStorage
      alert(`Deposit successful! New Balance: RS.${user.balance}`);
      window.location.href = 'dashboard.html'; // Redirect to refresh balance
    } else {
      alert('Please enter a valid amount!');
    }
  } else {
    alert('Invalid account number or password!');
  }
});

// Withdraw Functionality
document.getElementById('withdraw-form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const account = document.getElementById('withdraw-acc').value.trim();
  const password = document.getElementById('withdraw-pass').value;
  const amount = parseFloat(document.getElementById('withdraw-amt').value);

  console.log('Withdraw attempt with account:', account, 'and password:', password, 'amount:', amount);

  const user = findUser(account, password);

  if (user) {
    if (amount > 0) {
      if (amount <= user.balance) {
        console.log('Current Balance:', user.balance);
        user.balance -= amount;
        console.log('Updated Balance:', user.balance);

        user.transactions.push({ type: 'Withdraw', amount });
        localStorage.setItem('users', JSON.stringify(users)); // Update localStorage
        updateCurrentUserSession(user); // Update sessionStorage
        alert(`Withdraw successful! New Balance: RS.${user.balance}`);
        window.location.href = 'dashboard.html'; // Redirect to refresh balance
      } else {
        alert('Insufficient balance!');
      }
    } else {
      alert('Please enter a valid withdrawal amount greater than 0!');
    }
  } else {
    alert('Invalid account number or password!');
  }
});



