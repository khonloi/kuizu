import React, { useState } from 'react';
import { register } from '../../api/auth';
import './AuthForm.css';

const RegisterForm = ({ onToggle }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        displayName: '',
        bio: '',
        role: 'ROLE_STUDENT'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic frontend validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const data = await register(formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="error-msg">{error}</div>}

            <div className="form-group">
                <label>Username</label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Choose a username (3-50 chars)"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                    <input
                        type="email"
                        placeholder="Type your email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label>I am a...</label>
                <div className="role-selection">
                    <button
                        type="button"
                        className={`role-btn ${formData.role === 'ROLE_STUDENT' ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, role: 'ROLE_STUDENT' })}
                    >
                        Student
                    </button>
                    <button
                        type="button"
                        className={`role-btn ${formData.role === 'ROLE_TEACHER' ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, role: 'ROLE_TEACHER' })}
                    >
                        Teacher
                    </button>
                </div>
            </div>

            <div className="form-group">
                <label>Display Name (Optional)</label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Your public name (max 150 chars)"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Bio (Optional)</label>
                <div className="input-wrapper">
                    <textarea
                        placeholder="Tell others about yourself (max 500 chars)"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                    <input
                        type="password"
                        placeholder="Min 8 chars, 1 upper, 1 lower, 1 special"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>
            </div>

            <p className="terms-text">
                By clicking Sign up, you accept Kuizu's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>

            <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign up'}
            </button>

            <button type="button" className="secondary-btn" onClick={onToggle}>
                Already have an account? Log in
            </button>
        </form>
    );
};

export default RegisterForm;
