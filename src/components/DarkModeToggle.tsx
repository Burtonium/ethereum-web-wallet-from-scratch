import { useCallback, useState } from 'react';
import { Switch } from '@headlessui/react'
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { setTheme } from '@/utils';


const preference =  window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  
if (!document.cookie.includes('theme') && preference) {
  setTheme(preference);
}

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState<boolean>(localStorage.get('theme') === 'dark');

  const toggle = useCallback((toggled: boolean) => {
    setEnabled(toggled);
    setTheme(toggled ? 'dark' : 'light');
  }, []);

  return (
    <Switch
      checked={enabled}
      onChange={toggle}
      className={classNames(
        enabled ? 'bg-zinc-900' : 'bg-zinc-200',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-1'
      )}
    >
      <span className="sr-only">Use dark mode</span>
      <span
        className={classNames(
          enabled ? 'translate-x-5 bg-zinc-700/50' : 'translate-x-0',
          'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
        )}
      >
        <span
          className={classNames(
            enabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in',
            'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
          )}
          aria-hidden="true"
        >
          <FontAwesomeIcon className="text-orange-300 w-4 h-4" icon={faSun} />
        </span>
        <span
          className={classNames(
            enabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out',
            'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
          )}
          aria-hidden="true"
        >
          
          <FontAwesomeIcon className='text-zinc-200 w-4 h-4' icon={faMoon} />
        </span>
      </span>
    </Switch>
  )
}
