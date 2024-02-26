import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react';
import DarkModeToggle from './DarkModeToggle';
import classNames from 'classnames';
import useNetworks from '@/hooks/useNetwork';


export default function Navbar() {
  const { networks, selectedNetwork, selectNetwork } = useNetworks();

  return (
    <nav className="bg-gray-800">
      <div className="px-2 mx-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center">

          </div>
          <div className="flex-shrink-0 flex items-center">
            <img
              className="block  h-8 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
              alt="Workflow"
            />
          </div>
          <div className="sm:ml-6">
            <div className="flex space-x-4">
              <div className='flex items-center'>
                <DarkModeToggle />
              </div>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="gap-2 inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                    <img
                      className="w-6 h-6 rounded-full"
                      src={selectedNetwork?.rpcPrefs.imageUrl}
                      alt="Network icon" />
                    <span>
                      {selectedNetwork?.nickname ?? 'Select Network'}
                    </span>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                      {networks.map((network) => (
                        <Menu.Item key={network.chainId}>
                          {({ active }) => (
                            <button
                              onClick={() => selectNetwork(network.chainId)}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm w-full text-left'
                              )}
                            >
                              {network.nickname}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
