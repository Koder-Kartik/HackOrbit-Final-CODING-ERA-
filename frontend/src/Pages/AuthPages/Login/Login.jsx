import './Login.css';
import { useState } from 'react';
import SuccessModal from '../../../Components/SuccessModal/SuccessModal';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: ''
    });

    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.role) {
            setError('Please select a role');
            return;
        }

        localStorage.setItem('userRole', formData.role);

        setShowSuccessModal(true);
        setTimeout(() => {
            setShowSuccessModal(false);
            navigate(`/dashboard/${formData.role}dashboard`);
        }, 1000);
    };

    return (
        <div className='login-container'>
            <SuccessModal isOpen={showSuccessModal} />
            <div className='login-box'>
                <div className='login-header'>
                    <h1>VitalCheck</h1>
                    <p>Welcome back to your healthcare dashboard</p>
                </div>
                <form onSubmit={handleSubmit} className='login-form'>
                    <div className='form-group-login'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder='Enter your email'
                            required
                        />
                    </div>
                    <div className='form-group-login'>
                        <label htmlFor='password'>Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id='password'
                            name='password'
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder='Enter your password'
                            required
                        />
                        <button
                            type='button'
                            className='password-toggle'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className='form-group-signup'>
                        <label htmlFor='role'>Role</label>
                        <select
                            id='role'
                            name='role'
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                        >
                            <option value='' disabled>Choose your role</option>
                            <option value='doctor'>Doctor</option>
                            <option value='patient'>Patient</option>
                            <option value='personal'>Personal</option>
                        </select>
                    </div>
                    {error && <div className='error-message'>{error}</div>}
                    <div className='form-options'>
                        <a href='/forgot-password' className='forgot-password'>Forgot Password?</a>
                    </div>
                    <button type='submit' className='login-button'>Go to Dashboard</button>
                    <p className='signup-prompt'>
                        Don't have an account? <a href='/signup'>Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
