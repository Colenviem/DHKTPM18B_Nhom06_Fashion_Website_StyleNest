import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    FiSettings, FiLock, FiFeather, FiCode, FiSave, 
    FiChevronRight, FiAlertTriangle, FiMail, FiPhone, FiInfo, FiPlus 
} from 'react-icons/fi';

// --- Cấu hình Tab ---
const settingsTabs = [
    { id: 'general', label: 'Cài đặt Chung', icon: FiSettings, description: 'Thông tin cơ bản về hệ thống.' },
    { id: 'security', label: 'Bảo mật & Tài khoản', icon: FiLock, description: 'Quản lý mật khẩu và xác thực.' },
    { id: 'appearance', label: 'Giao diện', icon: FiFeather, description: 'Thay đổi chủ đề và layout.' },
    { id: 'integration', label: 'Tích hợp API', icon: FiCode, description: 'Quản lý khóa API và webhook.' },
];

// --- Hàm Cấu hình Form Inputs ---
const FormInput = ({ label, type = 'text', value, onChange, placeholder, description, required = false, disabled = false }) => (
    <div className="space-y-1">
        <label className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'textarea' ? (
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-100"
                disabled={disabled}
            />
        ) : (
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-100"
                disabled={disabled}
            />
        )}
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
);

// --- Component Content cho từng Tab ---

const GeneralSettings = ({ settings, setSettings }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Thông tin Cơ bản</h3>
        
        <FormInput 
            label="Tên Hệ Thống (Site Name)"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            placeholder="DashStack E-commerce Admin"
            required
        />
        
        <FormInput 
            label="Mô tả Ngắn"
            type="textarea"
            value={settings.siteDescription}
            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            placeholder="Hệ thống quản lý hàng tồn kho và đơn hàng."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput 
                label="Email Hỗ trợ"
                type="email"
                icon={FiMail}
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            />
             <FormInput 
                label="Số điện thoại"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
            />
        </div>
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 flex items-center gap-3">
            <FiAlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>Lưu ý: Thay đổi các mục này có thể yêu cầu khởi động lại một số dịch vụ.</p>
        </div>
    </motion.div>
);

const SecuritySettings = ({ settings, setSettings }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Quản lý Mật khẩu</h3>
        
        <FormInput 
            label="Mật khẩu hiện tại"
            type="password"
            value={settings.currentPassword}
            onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
            required
        />
        <FormInput 
            label="Mật khẩu mới"
            type="password"
            value={settings.newPassword}
            onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
            required
            description="Mật khẩu phải dài tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số."
        />

        <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 pt-4 mb-4">Xác thực Hai Yếu tố (2FA)</h3>
        
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div>
                <p className="font-medium text-gray-800">Trạng thái 2FA</p>
                <p className="text-sm text-gray-500">Bảo vệ tài khoản bằng lớp bảo mật bổ sung.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={settings.twoFactorEnabled}
                    onChange={(e) => setSettings({ ...settings, twoFactorEnabled: e.target.checked })}
                    className="sr-only peer"
                />
                <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${settings.twoFactorEnabled ? 'peer-checked:bg-indigo-600' : ''}`}></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                    {settings.twoFactorEnabled ? 'Đang Bật' : 'Đang Tắt'}
                </span>
            </label>
        </div>
    </motion.div>
);

const AppearanceSettings = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Chủ đề Màu sắc</h3>
        
        <div className="flex space-x-4">
            {['Indigo (Mặc định)', 'Cyan (Sáng)', 'Rose (Nữ tính)'].map(theme => (
                <div 
                    key={theme} 
                    className={`p-4 rounded-xl shadow-md border-2 transition-all cursor-pointer w-1/3 text-center ${
                        theme === 'Indigo (Mặc định)' 
                        ? 'border-indigo-600 ring-4 ring-indigo-100' 
                        : 'border-gray-300 hover:border-indigo-400'
                    }`}
                >
                    <div className={`w-full h-12 rounded-lg mb-2 ${theme.includes('Indigo') ? 'bg-indigo-600' : theme.includes('Cyan') ? 'bg-cyan-500' : 'bg-rose-500'}`}></div>
                    <p className="text-sm font-medium text-gray-700">{theme}</p>
                </div>
            ))}
        </div>

        <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 pt-4 mb-4">Tùy chọn Layout</h3>
        <p className="text-gray-700 text-sm">Hiện tại chỉ hỗ trợ layout cố định (fixed sidebar).</p>
        
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex items-center gap-3">
            <FiInfo className="w-5 h-5 flex-shrink-0" />
            <p>Tính năng tùy chỉnh giao diện phức tạp sẽ được bổ sung trong các bản cập nhật sắp tới.</p>
        </div>
    </motion.div>
);

const IntegrationSettings = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Quản lý Khóa API</h3>
        
        <FormInput 
            label="Khóa API Công khai (Public Key)"
            value="pk_live_*******************"
            onChange={() => {}}
            disabled
            description="Khóa này dùng để truy vấn dữ liệu công khai từ ứng dụng của bạn."
        />

        <FormInput 
            label="Khóa API Bí mật (Secret Key)"
            type="password"
            value="sk_live_*******************"
            onChange={() => {}}
            disabled
            description="Không chia sẻ khóa này. Dùng để xác thực các yêu cầu nhạy cảm."
        />
        
        <div className="flex justify-end">
            <button
                className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg text-sm hover:bg-red-600 transition-colors shadow-md flex items-center gap-1.5"
            >
                <FiAlertTriangle className="w-4 h-4" /> 
                Tạo lại Khóa API
            </button>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 pt-4 mb-4">Webhook Events</h3>
        <p className="text-gray-700 text-sm">Chưa có webhook nào được cấu hình.</p>
        <button
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-1.5"
        >
            <FiPlus className="w-4 h-4" /> 
            Thêm Webhook
        </button>

    </motion.div>
);


const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState(settingsTabs[0].id);
    const [settings, setSettings] = useState({
        siteName: 'DashStack E-commerce Admin',
        siteDescription: 'Hệ thống quản lý hàng tồn kho và đơn hàng.',
        supportEmail: 'support@dashstack.com',
        supportPhone: '0987-654-321',
        currentPassword: '',
        newPassword: '',
        twoFactorEnabled: false,
    });

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralSettings settings={settings} setSettings={setSettings} />;
            case 'security':
                return <SecuritySettings settings={settings} setSettings={setSettings} />;
            case 'appearance':
                return <AppearanceSettings />;
            case 'integration':
                return <IntegrationSettings />;
            default:
                return null;
        }
    };
    
    const handleSave = () => {
        console.log('Đã lưu cài đặt:', settings);
        alert('Đã lưu thành công!'); 
    };


    return (
        <div className="p-6 pt-24 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                <FiSettings className="w-8 h-8 text-indigo-600" />
                Cài đặt Hệ thống Quản trị
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-sm font-bold uppercase text-gray-500 mb-3 tracking-wider">Mục Cài đặt</h3>
                        <div className="space-y-1">
                            {settingsTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        w-full text-left flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                                        ${activeTab === tab.id
                                            ? "bg-indigo-500 text-white font-semibold shadow-md"
                                            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                                        }
                                    `}
                                >
                                    <tab.icon className="w-5 h-5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm">{tab.label}</p>
                                        <p className={`text-xs ${activeTab === tab.id ? 'text-indigo-200' : 'text-gray-400'}`}>{tab.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- Cột 2-4: Nội dung Cài đặt & Nút Lưu --- */}
                <div className="md:col-span-3 space-y-6">
                    
                    {/* Phần nội dung chính (Card) */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        {renderContent()}
                    </div>
                    
                    {/* Nút Lưu Thay Đổi (Sticky Footer) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5 }}
                        className="p-4 bg-white rounded-xl shadow-xl border border-gray-200 sticky bottom-0 z-10 flex justify-end"
                    >
                        <button
                            onClick={handleSave}
                            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg text-md hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-300 flex items-center gap-2"
                        >
                            <FiSave className="w-5 h-5" />
                            Lưu Thay Đổi
                        </button>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default AdminSettings;