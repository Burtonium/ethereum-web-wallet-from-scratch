export const setTheme = (theme: 'light' | 'dark') => {
  localStorage.theme = theme;
  if (theme === 'light') {
    document.querySelector('html')?.classList.remove('dark');
  } else {
    document.querySelector('html')?.classList.add('dark');
  }
}