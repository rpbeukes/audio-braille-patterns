import { useState } from 'react';

export default function SidebarToggle() {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(o => !o);
    document.getElementById('sidebar')?.classList.toggle('open');
  };

  return (
    <button
      type="button"
      aria-label="Toggle navigation menu"
      aria-expanded={open}
      className="sidebar-toggle-btn"
      onClick={toggle}
    >
      <span className="material-icons">menu</span>
    </button>
  );
}
