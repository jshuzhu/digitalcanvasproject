// nav.js — Shared navbar logic for DigitalCanvasMy
// Include this AFTER supabase-client.js on every page
// No "defer" needed — place script tag at bottom of <body>

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/d/1zW2AVaMEXwfeSppqKUr5ScEXmT8qf26A';

// ── Avatar loader ──────────────────────────────────────────────────────────
(async function initNav() {
  const avatarEl = document.getElementById('nav-avatar');
  if (!avatarEl) return;

  // Set default immediately so something always shows
  avatarEl.src = DEFAULT_AVATAR;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .eq('user_id', user.id)
      .single();

    if (profile?.avatar_url) {
      avatarEl.src = profile.avatar_url;
    }
  } catch (err) {
    // Silently fall back to default avatar already set above
  }
})();

// ── Dropdown toggle ────────────────────────────────────────────────────────
function toggleProfileMenu(event) {
  // Stop click from immediately bubbling to the document listener below
  if (event) event.stopPropagation();

  const menu = document.getElementById('profile-menu');
  if (!menu) return;
  menu.classList.toggle('hidden');
}

// ── Close when clicking outside ────────────────────────────────────────────
document.addEventListener('click', function (e) {
  const menu = document.getElementById('profile-menu');
  const trigger = document.getElementById('nav-avatar-btn');
  if (!menu || menu.classList.contains('hidden')) return;

  // If click is outside both the menu and the trigger button, close it
  if (!menu.contains(e.target) && trigger && !trigger.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

// ── Close on Escape key ────────────────────────────────────────────────────
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const menu = document.getElementById('profile-menu');
    if (menu) menu.classList.add('hidden');
  }
});