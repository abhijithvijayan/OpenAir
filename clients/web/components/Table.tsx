import React from 'react';
import 'twin.macro';

const Table: React.FC = () => {
  return (
    <>
      <table tw="min-w-full">
        <thead>
          <tr>
            <th tw="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200">
              Name
            </th>
            <th tw="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200">
              Title
            </th>
            <th tw="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200">
              Status
            </th>
            <th tw="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200">
              Role
            </th>
            <th tw="px-6 py-3 border-b border-gray-200" />
          </tr>
        </thead>

        <tbody tw="bg-white">
          <tr>
            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="flex items-center">
                <div tw="flex-shrink-0 w-10 h-10">
                  <img
                    tw="w-10 h-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>

                <div tw="ml-4">
                  <div tw="text-sm font-medium leading-5 text-gray-900">
                    John Doe
                  </div>
                  <div tw="text-sm leading-5 text-gray-500">
                    john@example.com
                  </div>
                </div>
              </div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="text-sm leading-5 text-gray-900">Software Engineer</div>
              <div tw="text-sm leading-5 text-gray-500">Web dev</div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <span tw="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                Active
              </span>
            </td>

            <td tw="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
              Owner
            </td>

            <td tw="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
              <a href="#" tw="hover:text-indigo-900 text-indigo-600">
                Edit
              </a>
            </td>
          </tr>
          <tr>
            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="flex items-center">
                <div tw="flex-shrink-0 w-10 h-10">
                  <img
                    tw="w-10 h-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>

                <div tw="ml-4">
                  <div tw="text-sm font-medium leading-5 text-gray-900">
                    John Doe
                  </div>
                  <div tw="text-sm leading-5 text-gray-500">
                    john@example.com
                  </div>
                </div>
              </div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="text-sm leading-5 text-gray-900">Software Engineer</div>
              <div tw="text-sm leading-5 text-gray-500">Web dev</div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <span tw="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                Active
              </span>
            </td>

            <td tw="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
              Owner
            </td>

            <td tw="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
              <a href="#" tw="hover:text-indigo-900 text-indigo-600">
                Edit
              </a>
            </td>
          </tr>
          <tr>
            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="flex items-center">
                <div tw="flex-shrink-0 w-10 h-10">
                  <img
                    tw="w-10 h-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>

                <div tw="ml-4">
                  <div tw="text-sm font-medium leading-5 text-gray-900">
                    John Doe
                  </div>
                  <div tw="text-sm leading-5 text-gray-500">
                    john@example.com
                  </div>
                </div>
              </div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="text-sm leading-5 text-gray-900">Software Engineer</div>
              <div tw="text-sm leading-5 text-gray-500">Web dev</div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <span tw="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                Active
              </span>
            </td>

            <td tw="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
              Owner
            </td>

            <td tw="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
              <a href="#" tw="hover:text-indigo-900 text-indigo-600">
                Edit
              </a>
            </td>
          </tr>
          <tr>
            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="flex items-center">
                <div tw="flex-shrink-0 w-10 h-10">
                  <img
                    tw="w-10 h-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>

                <div tw="ml-4">
                  <div tw="text-sm font-medium leading-5 text-gray-900">
                    John Doe
                  </div>
                  <div tw="text-sm leading-5 text-gray-500">
                    john@example.com
                  </div>
                </div>
              </div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="text-sm leading-5 text-gray-900">Software Engineer</div>
              <div tw="text-sm leading-5 text-gray-500">Web dev</div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <span tw="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                Active
              </span>
            </td>

            <td tw="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
              Owner
            </td>

            <td tw="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
              <a href="#" tw="hover:text-indigo-900 text-indigo-600">
                Edit
              </a>
            </td>
          </tr>
          <tr>
            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="flex items-center">
                <div tw="flex-shrink-0 w-10 h-10">
                  <img
                    tw="w-10 h-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>

                <div tw="ml-4">
                  <div tw="text-sm font-medium leading-5 text-gray-900">
                    John Doe
                  </div>
                  <div tw="text-sm leading-5 text-gray-500">
                    john@example.com
                  </div>
                </div>
              </div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="text-sm leading-5 text-gray-900">Software Engineer</div>
              <div tw="text-sm leading-5 text-gray-500">Web dev</div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <span tw="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                Active
              </span>
            </td>

            <td tw="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
              Owner
            </td>

            <td tw="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
              <a href="#" tw="hover:text-indigo-900 text-indigo-600">
                Edit
              </a>
            </td>
          </tr>
          <tr>
            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="flex items-center">
                <div tw="flex-shrink-0 w-10 h-10">
                  <img
                    tw="w-10 h-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>

                <div tw="ml-4">
                  <div tw="text-sm font-medium leading-5 text-gray-900">
                    John Doe
                  </div>
                  <div tw="text-sm leading-5 text-gray-500">
                    john@example.com
                  </div>
                </div>
              </div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="text-sm leading-5 text-gray-900">Software Engineer</div>
              <div tw="text-sm leading-5 text-gray-500">Web dev</div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <span tw="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                Active
              </span>
            </td>

            <td tw="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
              Owner
            </td>

            <td tw="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
              <a href="#" tw="hover:text-indigo-900 text-indigo-600">
                Edit
              </a>
            </td>
          </tr>
          <tr>
            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="flex items-center">
                <div tw="flex-shrink-0 w-10 h-10">
                  <img
                    tw="w-10 h-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>

                <div tw="ml-4">
                  <div tw="text-sm font-medium leading-5 text-gray-900">
                    John Doe
                  </div>
                  <div tw="text-sm leading-5 text-gray-500">
                    john@example.com
                  </div>
                </div>
              </div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="text-sm leading-5 text-gray-900">Software Engineer</div>
              <div tw="text-sm leading-5 text-gray-500">Web dev</div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <span tw="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                Active
              </span>
            </td>

            <td tw="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
              Owner
            </td>

            <td tw="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
              <a href="#" tw="hover:text-indigo-900 text-indigo-600">
                Edit
              </a>
            </td>
          </tr>
          <tr>
            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="flex items-center">
                <div tw="flex-shrink-0 w-10 h-10">
                  <img
                    tw="w-10 h-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>

                <div tw="ml-4">
                  <div tw="text-sm font-medium leading-5 text-gray-900">
                    John Doe
                  </div>
                  <div tw="text-sm leading-5 text-gray-500">
                    john@example.com
                  </div>
                </div>
              </div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="text-sm leading-5 text-gray-900">Software Engineer</div>
              <div tw="text-sm leading-5 text-gray-500">Web dev</div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <span tw="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                Active
              </span>
            </td>

            <td tw="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
              Owner
            </td>

            <td tw="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
              <a href="#" tw="hover:text-indigo-900 text-indigo-600">
                Edit
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Table;
