import { useElementeStore } from '@/stores/elementsStore';
import { Search } from 'lucide-react'
import {useState} from 'react'
import Elements from './Elements'

const ElementsList = () => {
  const [value, setValue] = useState('');
  const { elementsList } = useElementeStore()

  return (
    <div className='min-w-[22rem] w-[22rem] h-full border-l-[1px]'>
      <div className='w-full h-12 flex gap-2 items-center justify-start px-4 border-b-[2px]'>
        <Search className='text-gray-500'/>
        <input
          type='text'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='Search elements...'
          className='w-full h-full active:outline-none focus:outline-none bg-transparent border-none text-gray-800 placeholder:text-gray-400'
        />
      </div>

      <div className='flex flex-wrap gap-2 p-3'>
        {elementsList.map((element) => (
          <Elements
            key={element.elementId}
            element={element}
          />
        ))}
      </div>
    </div>
  )
}

export default ElementsList