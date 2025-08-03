// Global State Management
let currentPage = 'discover';
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
let theme = localStorage.getItem('theme') || 'light';
let sidebarCollapsed = false;

// Sample internship data
const internships = [
    {
        id: '1',
        title: 'Software Development Engineer',
        company: 'TechCorp Solutions',
        isVerified: true,
        location: 'Bangalore, India',
        mode: 'Remote',
        duration: '6 months',
        description: 'Join our dynamic team to develop cutting-edge software solutions. Work with modern technologies and gain hands-on experience in full-stack development.',
        skills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'AWS'],
        deadline: 'Jan 25, 2024',
        isPaid: true,
        stipend: '₹25,000/month',
        tags: ['Software Development', 'Full Stack', 'Web Development'],
        category: 'Computer Information Technology'
    },
    {
        id: '2',
        title: 'Machine Learning Engineer',
        company: 'AI Innovations Ltd',
        isVerified: true,
        location: 'Mumbai, India',
        mode: 'Remote',
        duration: '6 months',
        description: 'Develop and deploy machine learning models for real-world applications. Work with cutting-edge AI technologies and learn from industry experts.',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'Scikit-learn'],
        deadline: 'Jan 20, 2024',
        isPaid: true,
        stipend: '₹20,000/month',
        tags: ['AI', 'Machine Learning', 'Python'],
        category: 'Computer Information Technology'
    },
    {
        id: '3',
        title: 'Digital Signal Processing',
        company: 'SignalTech Industries',
        isVerified: true,
        location: 'Chennai, India',
        mode: 'On-site',
        duration: '4 months',
        description: 'Work on advanced signal processing algorithms and digital filter design. Gain experience with MATLAB, FPGA programming, and real-time systems.',
        skills: ['MATLAB', 'FPGA', 'Verilog', 'Signal Processing', 'DSP'],
        deadline: 'Feb 5, 2024',
        isPaid: true,
        stipend: '₹22,000/month',
        tags: ['DSP', 'FPGA', 'Signal Processing'],
        category: 'Electronics and Computer Science'
    },
    {
        id: '4',
        title: 'Embedded Systems Developer',
        company: 'EmbedTech Solutions',
        isVerified: true,
        location: 'Pune, India',
        mode: 'Hybrid',
        duration: '5 months',
        description: 'Design and develop embedded systems for IoT applications. Work with microcontrollers, sensors, and wireless communication protocols.',
        skills: ['C/C++', 'ARM Cortex', 'IoT', 'RTOS', 'PCB Design'],
        deadline: 'Jan 28, 2024',
        isPaid: true,
        stipend: '₹18,000/month',
        tags: ['Embedded Systems', 'IoT', 'Microcontrollers'],
        category: 'Electronics and Computer Science'
    },
    {
        id: '5',
        title: 'Mobile App Development',
        company: 'AppVenture Studio',
        isVerified: true,
        location: 'Hyderabad, India',
        mode: 'Hybrid',
        duration: '4 months',
        description: 'Build native and cross-platform mobile applications. Learn modern mobile development frameworks and user experience design principles.',
        skills: ['React Native', 'Flutter', 'JavaScript', 'Dart', 'Firebase'],
        deadline: 'Jan 30, 2024',
        isPaid: true,
        stipend: '₹18,000/month',
        tags: ['Mobile', 'React Native', 'Flutter'],
        category: 'Computer Information Technology'
    },
    {
        id: '6',
        title: 'Wireless Communication Systems',
        company: 'WirelessTech Corp',
        isVerified: true,
        location: 'Delhi, India',
        mode: 'On-site',
        duration: '6 months',
        description: 'Work on 5G and wireless communication technologies. Learn about antenna design, RF systems, and network protocols.',
        skills: ['RF Engineering', '5G', 'Antenna Design', 'Network Protocols', 'MATLAB'],
        deadline: 'Feb 10, 2024',
        isPaid: true,
        stipend: '₹24,000/month',
        tags: ['5G', 'Wireless', 'RF Engineering'],
        category: 'Electronics and Telecommunication'
    },
    {
        id: '7',
        title: 'Frontend Developer',
        company: 'WebCraft Solutions',
        isVerified: true,
        location: 'Delhi, India',
        mode: 'Remote',
        duration: '3 months',
        description: 'Create responsive and interactive user interfaces using modern web technologies.',
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
        deadline: 'Jan 15, 2024',
        isPaid: true,
        stipend: '₹14,000/month',
        tags: ['Frontend', 'React', 'Web Development'],
        category: 'Computer Information Technology'
    },
    {
        id: '8',
        title: 'Medical Device Development',
        company: 'MedTech Innovations',
        isVerified: true,
        location: 'Bangalore, India',
        mode: 'On-site',
        duration: '6 months',
        description: 'Develop biomedical devices and diagnostic equipment. Work on medical imaging, patient monitoring systems, and FDA compliance.',
        skills: ['Biomedical Engineering', 'Medical Imaging', 'LabVIEW', 'FDA Regulations', 'MATLAB'],
        deadline: 'Feb 15, 2024',
        isPaid: true,
        stipend: '₹26,000/month',
        tags: ['Medical Devices', 'Biomedical', 'FDA'],
        category: 'Biomedical Engineering'
    },
    {
        id: '9',
        title: 'Optical Communication Engineer',
        company: 'FiberOptic Systems',
        isVerified: true,
        location: 'Mumbai, India',
        mode: 'Hybrid',
        duration: '5 months',
        description: 'Design and test fiber optic communication systems. Work with laser diodes, photodetectors, and optical network equipment.',
        skills: ['Fiber Optics', 'Optical Networks', 'Laser Technology', 'Photonics', 'Network Testing'],
        deadline: 'Feb 8, 2024',
        isPaid: true,
        stipend: '₹23,000/month',
        tags: ['Fiber Optics', 'Optical Networks', 'Photonics'],
        category: 'Electronics and Telecommunication'
    },
    {
        id: '10',
        title: 'Biomedical Imaging Specialist',
        company: 'Imaging Solutions Ltd',
        isVerified: true,
        location: 'Chennai, India',
        mode: 'On-site',
        duration: '4 months',
        description: 'Work on MRI, CT scan, and ultrasound imaging technologies. Develop image processing algorithms for medical diagnosis.',
        skills: ['Medical Imaging', 'Image Processing', 'MRI Technology', 'Python', 'Medical Physics'],
        deadline: 'Feb 12, 2024',
        isPaid: true,
        stipend: '₹28,000/month',
        tags: ['Medical Imaging', 'MRI', 'Image Processing'],
        category: 'Biomedical Engineering'
    }
];

// Search suggestions data
const searchSuggestions = {
    skills: ['React', 'Node.js', 'Python', 'JavaScript', 'Machine Learning', 'AI', 'FPGA', 'IoT', 'Flutter', '5G'],
    companies: ['TechCorp Solutions', 'AI Innovations Ltd', 'SignalTech Industries', 'EmbedTech Solutions', 'AppVenture Studio'],
    locations: ['Bangalore', 'Mumbai', 'Chennai', 'Delhi', 'Pune', 'Hyderabad']
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    updateBookmarkCount();
    showInternships('all');
    
    // Show landing page by default
    if (!localStorage.getItem('hasVisited')) {
        showLandingPage();
    } else {
        showMainApp();
    }
});

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    initializeTheme();
}

// Page Navigation
function showLandingPage() {
    document.getElementById('landing-page').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
}

function showMainApp() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    localStorage.setItem('hasVisited', 'true');
}

function showPage(pageName) {
    // Hide landing page and show main app
    showMainApp();
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update sidebar active state
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[data-page="${pageName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    currentPage = pageName;
    
    // Load page-specific content
    if (pageName === 'bookmarks') {
        showBookmarkedInternships();
    } else if (pageName === 'discover') {
        showInternships('all');
    }
}

// Sidebar Management
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 768) {
        // Mobile: toggle sidebar visibility
        sidebar.classList.toggle('mobile-open');
    } else {
        // Desktop: toggle sidebar collapse
        sidebarCollapsed = !sidebarCollapsed;
        if (sidebarCollapsed) {
            sidebar.style.transform = 'translateX(-100%)';
            mainContent.classList.add('expanded');
        } else {
            sidebar.style.transform = 'translateX(0)';
            mainContent.classList.remove('expanded');
        }
    }
}

// User Menu
function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function signOut() {
    localStorage.removeItem('hasVisited');
    showLandingPage();
    toggleUserMenu();
}

// Search Functionality
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (query.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    // Get context-specific suggestions
    let suggestions = [];
    
    if (currentPage === 'discover' || currentPage === 'bookmarks') {
        // Search in internships
        const matchingInternships = internships.filter(internship =>
            internship.title.toLowerCase().includes(query) ||
            internship.company.toLowerCase().includes(query) ||
            internship.skills.some(skill => skill.toLowerCase().includes(query)) ||
            internship.location.toLowerCase().includes(query)
        );
        
        suggestions = matchingInternships.slice(0, 5).map(internship => ({
            text: internship.title,
            type: 'internship',
            id: internship.id
        }));
        
        // Add skill suggestions
        const skillMatches = searchSuggestions.skills.filter(skill => 
            skill.toLowerCase().includes(query)
        ).slice(0, 3);
        
        skillMatches.forEach(skill => {
            suggestions.push({ text: skill, type: 'skill' });
        });
    } else if (currentPage === 'profile') {
        suggestions = [
            { text: 'Personal Information', type: 'section' },
            { text: 'Academic Details', type: 'section' },
            { text: 'Skills', type: 'section' }
        ].filter(item => item.text.toLowerCase().includes(query));
    } else if (currentPage === 'settings') {
        suggestions = [
            { text: 'Dark Mode', type: 'setting' },
            { text: 'Notifications', type: 'setting' },
            { text: 'Account Settings', type: 'setting' }
        ].filter(item => item.text.toLowerCase().includes(query));
    }
    
    displaySearchSuggestions(suggestions.slice(0, 5));
}

function displaySearchSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    suggestionsContainer.innerHTML = suggestions.map(suggestion => 
        `<div class="search-suggestion" onclick="selectSuggestion('${suggestion.text}', '${suggestion.type}', '${suggestion.id || ''}')">${suggestion.text}</div>`
    ).join('');
    
    suggestionsContainer.style.display = 'block';
}

function selectSuggestion(text, type, id) {
    const searchInput = document.getElementById('search-input');
    searchInput.value = text;
    document.getElementById('search-suggestions').style.display = 'none';
    
    if (type === 'internship' && id) {
        // Navigate to discover page and highlight the internship
        showPage('discover');
        highlightInternship(id);
    } else if (type === 'skill') {
        // Filter internships by skill
        showPage('discover');
        filterInternshipsBySearch(text);
    }
}

function highlightInternship(id) {
    setTimeout(() => {
        const card = document.querySelector(`[data-internship-id="${id}"]`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.border = '2px solid var(--primary)';
            setTimeout(() => {
                card.style.border = '1px solid var(--border)';
            }, 3000);
        }
    }, 100);
}

function filterInternshipsBySearch(query) {
    const filteredInternships = internships.filter(internship =>
        internship.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase())) ||
        internship.title.toLowerCase().includes(query.toLowerCase()) ||
        internship.company.toLowerCase().includes(query.toLowerCase())
    );
    
    displayInternships(filteredInternships);
}

// Internship Display
function showInternships(category) {
    // Update filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = category === 'all' ? 
        document.querySelector('.filter-btn') : 
        Array.from(filterBtns).find(btn => btn.textContent.includes(getCategoryShortName(category)));
    
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Filter internships
    let filteredInternships = category === 'all' ? 
        internships : 
        internships.filter(internship => internship.category === category);
    
    displayInternships(filteredInternships);
}

function getCategoryShortName(category) {
    const mapping = {
        'Computer Information Technology': 'Computer IT',
        'Electronics and Computer Science': 'Electronics & CS',
        'Electronics and Telecommunication': 'Electronics & Telecom',
        'Biomedical Engineering': 'Biomedical Engineering'
    };
    return mapping[category] || category;
}

function displayInternships(internshipList) {
    const grid = document.getElementById('internship-grid');
    
    if (internshipList.length === 0) {
        grid.innerHTML = '<div class="no-results">No internships found matching your criteria.</div>';
        return;
    }
    
    grid.innerHTML = internshipList.map(internship => createInternshipCard(internship)).join('');
}

function createInternshipCard(internship) {
    const isBookmarked = bookmarks.includes(internship.id);
    
    return `
        <div class="internship-card" data-internship-id="${internship.id}">
            <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" onclick="toggleBookmark('${internship.id}')">
                <i class="fas fa-bookmark"></i>
            </button>
            
            <div class="internship-header">
                <div>
                    <div class="internship-title">${internship.title}</div>
                    <div class="internship-company">
                        ${internship.company}
                        ${internship.isVerified ? '<i class="fas fa-check-circle" style="color: #10b981; margin-left: 0.5rem;"></i>' : ''}
                    </div>
                </div>
            </div>
            
            <div class="internship-meta">
                <span class="badge">${internship.mode}</span>
                <span class="badge">${internship.location}</span>
                <span class="badge">${internship.duration}</span>
                ${internship.isPaid ? `<span class="badge primary">${internship.stipend}</span>` : '<span class="badge">Unpaid</span>'}
            </div>
            
            <div class="internship-description">
                ${internship.description}
            </div>
            
            <div class="internship-skills">
                ${internship.skills.slice(0, 4).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                ${internship.skills.length > 4 ? `<span class="skill-tag">+${internship.skills.length - 4} more</span>` : ''}
            </div>
            
            <div class="internship-footer">
                <div class="deadline">Deadline: ${internship.deadline}</div>
                <div class="internship-actions">
                    <button class="btn btn-secondary btn-sm" onclick="viewInternshipDetails('${internship.id}')">Details</button>
                    <button class="btn btn-primary btn-sm" onclick="applyToInternship('${internship.id}')">Apply</button>
                </div>
            </div>
        </div>
    `;
}

// Internship Actions
function viewInternshipDetails(id) {
    const internship = internships.find(i => i.id === id);
    if (internship) {
        alert(`Viewing details for: ${internship.title}\n\nCompany: ${internship.company}\nLocation: ${internship.location}\nDescription: ${internship.description}`);
    }
}

function applyToInternship(id) {
    const internship = internships.find(i => i.id === id);
    if (internship) {
        alert(`Application process initiated for: ${internship.title}\n\nYou would typically be redirected to the company's application portal.`);
    }
}

// Bookmark Management
function toggleBookmark(id) {
    const index = bookmarks.indexOf(id);
    
    if (index > -1) {
        bookmarks.splice(index, 1);
    } else {
        bookmarks.push(id);
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    updateBookmarkCount();
    
    // Update bookmark button appearance
    const bookmarkBtn = document.querySelector(`[data-internship-id="${id}"] .bookmark-btn`);
    if (bookmarkBtn) {
        bookmarkBtn.classList.toggle('active');
    }
    
    // If on bookmarks page, refresh the display
    if (currentPage === 'bookmarks') {
        showBookmarkedInternships();
    }
}

function updateBookmarkCount() {
    const countElement = document.getElementById('bookmark-count');
    if (countElement) {
        countElement.textContent = bookmarks.length;
    }
}

function showBookmarkedInternships() {
    const bookmarkedInternships = internships.filter(internship => bookmarks.includes(internship.id));
    const container = document.getElementById('bookmarked-internships');
    
    if (bookmarkedInternships.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i class="fas fa-bookmark" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No Bookmarks Yet</h3>
                <p>Start bookmarking internships from the Discover page to keep track of opportunities you're interested in.</p>
                <button class="btn btn-primary" onclick="showPage('discover')" style="margin-top: 1rem;">Discover Internships</button>
            </div>
        `;
    } else {
        container.innerHTML = bookmarkedInternships.map(internship => createInternshipCard(internship)).join('');
    }
}

// Filter functions
function filterInternships(category) {
    showInternships(category);
}

// Interview Preparation
function startInterview(type) {
    alert(`Starting ${type} interview preparation...\n\nThis would typically open an interactive interview simulation.`);
}

// Profile Management
function saveProfile() {
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    const phone = document.getElementById('profile-phone').value;
    
    // Save to localStorage
    const profileData = { name, email, phone };
    localStorage.setItem('profile', JSON.stringify(profileData));
    
    alert('Profile saved successfully!');
}

// Settings Management
function toggleSetting(toggleElement) {
    toggleElement.classList.toggle('active');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const userDropdown = document.getElementById('user-dropdown');
    const searchSuggestions = document.getElementById('search-suggestions');
    
    if (!event.target.closest('.user-menu')) {
        userDropdown.style.display = 'none';
    }
    
    if (!event.target.closest('.search-container')) {
        searchSuggestions.style.display = 'none';
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth > 768) {
        sidebar.classList.remove('mobile-open');
        if (!sidebarCollapsed) {
            sidebar.style.transform = 'translateX(0)';
            mainContent.classList.remove('expanded');
        }
    } else {
        sidebar.style.transform = 'translateX(-100%)';
        mainContent.classList.remove('expanded');
    }
});