import { signInUser } from '../../firebase/firebaseAuth';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) return;
    const user = await signInUser(formData.email, formData.password);
    if (user) {
      navigate('/');
    }
  };

  return (
    <main className='flex flex-col w-screen h-screen justify-center items-center'>
      <form
        className='flex flex-col border border-gray-500 p-3 rounded-md gap-3 items-center w-96'
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className='flex flex-col gap-2'>
          <label
            className='text-xlg'
            htmlFor='email'
          >
            Email
          </label>
          <input
            className='p-3 border border-gray-700 text-gray-700 rounded-sm'
            type='email'
            name='email'
            id='email'
            placeholder='Email'
            required
            onChange={(e) => handChange(e)}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label
            className='text-xlg'
            htmlFor='password'
          >
            Password
          </label>
          <input
            className='p-3 border border-gray-700 text-gray-700 rounded-sm'
            type='password'
            name='password'
            id='password'
            placeholder='Password'
            required
            onChange={(e) => handChange(e)}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label
            className='text-xlg'
            htmlFor='password'
          >
            Password
          </label>
          <input
            className='p-3 border border-gray-700 text-gray-700 rounded-sm'
            type='confirmPassword'
            name='confirmPassword'
            id='confirmPassword'
            placeholder='Confirm Password'
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <input
          className='text-xlg bg-red-600 text-white rounded-md hover:bg-red-700 p-3 min-w-[150px] cursor-pointer'
          type='submit'
          value='Sign Up'
        />
      </form>
    </main>
  );
}

export default SignIn;
