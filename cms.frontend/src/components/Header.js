import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // =========================
    // LOAD USER + CART
    // =========================
    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const total = cart.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(total);
        };

        const loadUser = () => {
            const u = JSON.parse(localStorage.getItem("user"));
            setUser(u);
        };

        updateCartCount();
        loadUser();

        window.addEventListener("cartUpdated", updateCartCount);
        window.addEventListener("userUpdated", loadUser);

        return () => {
            window.removeEventListener("cartUpdated", updateCartCount);
            window.removeEventListener("userUpdated", loadUser);
        };
    }, []);

    // =========================
    // LOGOUT
    // =========================
    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        window.dispatchEvent(new Event("userUpdated"));
        navigate("/");
    };

    const getAvatar = () => {
        if (user?.avatar) return <img src={user.avatar} alt="Avatar" style={styles.avatarImg} />;
        if (user?.fullName) {
            return user.fullName.charAt(0).toUpperCase();
        }
        return "U";
    };

    const handleSearchSubmit = (e) => {
        if (e.key === "Enter" && searchTerm.trim() !== "") {
            navigate(`/shop?search=${searchTerm}`);
        }
    };

    return (
        <header style={styles.header}>
            <div style={styles.container}>

                {/* LOGO */}
                <div style={styles.logo} onClick={() => navigate("/")}>
                    <span style={{ fontSize: "1.6rem" }}>👟</span>
                    <span style={styles.logoText}>ADIDAS</span>
                    <span style={styles.logoSub}>STORE</span>
                </div>

                {/* MENU NAVIGATION */}
                <nav style={styles.navMenu}>
                    <Link to="/" className="nav-link" style={styles.navLink}>Trang chủ</Link>
                    <Link to="/shop" className="nav-link" style={styles.navLink}>Cửa hàng</Link>
                    <Link to="/blog" className="nav-link" style={styles.navLink}>Tin tức</Link>
                </nav>

                {/* SEARCH BOX */}
                <div style={styles.searchBox}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearchSubmit}
                        style={styles.searchInput}
                        className="search-input-focus"
                    />
                </div>

                {/* ACTION BOX (CART + AUTH) */}
                <div style={styles.actionBox}>

                    {/* CART ICON WITH BADGE */}
                    <Link to="/cart" style={styles.cartBtn} className="cart-hover">
                        <span style={{ fontSize: "1.3rem" }}>🛒</span>
                        <span style={styles.cartLabel}>Giỏ hàng</span>
                        {cartCount > 0 && (
                            <span style={styles.cartBadge} className="pulse-animation">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* AUTH SECTION */}
                    <div style={styles.authBox}>
                        {/* CHƯA LOGIN */}
                        {!user && (
                            <div style={styles.authButtons}>
                                <Link to="/login" style={styles.btnLogin} className="btn-hover-opacity">
                                    Đăng nhập
                                </Link>
                                <Link to="/register" style={styles.btnRegister} className="btn-hover-scale">
                                    Đăng ký
                                </Link>
                            </div>
                        )}

                        {/* ĐÃ LOGIN -> DROPDOWN MENU FULL OPTION */}
                        {user && (
                            <div style={styles.userMenuWrapper} className="user-dropdown-hover">
                                <div style={styles.userInfo}>
                                    <div style={styles.avatar}>
                                        {getAvatar()}
                                    </div>
                                    <span style={styles.userName}>{user.fullName}</span>
                                    <span style={styles.dropdownArrow}>▼</span>
                                </div>

                                {/* Menu ẩn hiện khi hover */}
                                <div style={styles.dropdownMenu} className="dropdown-content">
                                    <div style={styles.dropdownHeader}>
                                        <strong>{user.fullName}</strong>
                                        <div style={{ fontSize: "0.8rem", color: "#aaa" }}>{user.email || "Thành viên"}</div>
                                    </div>
                                    <hr style={styles.divider} />
                                    <Link to="/profile" style={styles.dropdownItem}>👤 Hồ sơ của tôi</Link>
                                    <Link to="/orders" style={styles.dropdownItem}>📦 Đơn hàng đã mua</Link>
                                    <Link to="/change-password" style={styles.dropdownItem}>🔑 Đổi mật khẩu</Link>
                                    <hr style={styles.divider} />
                                    <div onClick={handleLogout} style={{ ...styles.dropdownItem, ...styles.logoutItem }}>
                                        🚪 Đăng xuất
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Nhúng CSS Hoạt Ảnh Nâng Cao - ĐÃ SỬA LỖI SECURITYERROR */}
            <style>{`
                /* Hiệu ứng gạch chân chạy dưới Menu Link */
                .nav-link {
                    position: relative;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -4px;
                    left: 0;
                    background-color: #2575fc;
                    transition: width 0.3s ease;
                }
                .nav-link:hover {
                    color: #2575fc !important;
                }
                .nav-link:hover::after {
                    width: 100%;
                }

                /* Hiệu ứng co dãn thanh tìm kiếm */
                .search-input-focus {
                    transition: all 0.3s ease;
                }
                .search-input-focus:focus {
                    width: 240px !important;
                    border-color: #2575fc !important;
                    background: rgba(255, 255, 255, 1) !important;
                    color: #333 !important;
                    box-shadow: 0 0 10px rgba(37, 117, 252, 0.2);
                }

                /* Hoạt ảnh bong bóng số giỏ hàng */
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }
                .pulse-animation {
                    animation: pulse 2s infinite ease-in-out;
                }

                /* Xử lý hiển thị Dropdown khi hover */
                .user-dropdown-hover {
                    position: relative;
                }
                .user-dropdown-hover:hover .dropdown-content {
                    opacity: 1 !important;
                    visibility: visible !important;
                    transform: translateY(0) !important;
                }
                
                /* Tương tác Menu Dropdown Item an toàn không lỗi */
                .dropdown-content a, .dropdown-content div {
                    transition: all 0.2s ease;
                }
                .dropdown-content a:hover {
                    background-color: #f5f5f5 !important;
                    color: #000 !important;
                }
                .dropdown-content div:last-child:hover {
                    background-color: #fff5f5 !important;
                    color: #e74c3c !important;
                }

                /* Hiệu ứng nút bấm */
                .btn-hover-opacity:hover { opacity: 0.8; }
                .btn-hover-scale:hover { transform: scale(1.05); }
                .cart-hover:hover { opacity: 0.85; }
            `}</style>
        </header>
    );
}

// Hệ thống Style chuẩn UI thương mại điện tử cao cấp
const styles = {
    header: {
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
    },
    logo: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer",
    },
    logoText: {
        fontSize: "1.4rem",
        fontWeight: "800",
        letterSpacing: "1px",
        color: "#111",
    },
    logoSub: {
        fontSize: "0.8rem",
        fontWeight: "400",
        color: "#666",
        borderLeft: "1px solid #ccc",
        paddingLeft: "6px",
        alignSelf: "flex-end",
        marginBottom: "4px",
    },
    navMenu: {
        display: "flex",
        gap: "25px",
    },
    navLink: {
        fontWeight: "600",
        color: "#444",
        fontSize: "0.95rem",
    },
    searchBox: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        flex: 1,
        maxWidth: "350px",
    },
    searchIcon: {
        position: "absolute",
        left: "12px",
        fontSize: "0.9rem",
        opacity: 0.5,
    },
    searchInput: {
        width: "180px",
        padding: "8px 12px 8px 35px",
        borderRadius: "20px",
        border: "1px solid rgba(0,0,0,0.15)",
        background: "rgba(0,0,0,0.03)",
        fontSize: "0.9rem",
        outline: "none",
        color: "#555",
    },
    actionBox: {
        display: "flex",
        alignItems: "center",
        gap: "25px",
    },
    cartBtn: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        textDecoration: "none",
        color: "#333",
        fontWeight: "500",
        fontSize: "0.95rem",
    },
    cartLabel: {
        display: "block",
    },
    cartBadge: {
        position: "absolute",
        top: "-8px",
        left: "15px",
        background: "linear-gradient(135deg, #ff512f, #dd2476)",
        color: "#fff",
        fontSize: "0.75rem",
        fontWeight: "700",
        borderRadius: "50%",
        minWidth: "18px",
        height: "18px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 4px",
        boxShadow: "0 2px 8px rgba(221, 36, 118, 0.4)",
    },
    authBox: {
        display: "flex",
        alignItems: "center",
    },
    authButtons: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    btnLogin: {
        textDecoration: "none",
        color: "#333",
        fontWeight: "600",
        fontSize: "0.95rem",
        padding: "8px 16px",
    },
    btnRegister: {
        textDecoration: "none",
        background: "linear-gradient(to right, #141e30, #243b55)",
        color: "#fff",
        fontWeight: "500",
        fontSize: "0.9rem",
        padding: "8px 18px",
        borderRadius: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        transition: "all 0.2s ease",
    },
    userMenuWrapper: {
        cursor: "pointer",
    },
    userInfo: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 12px",
        borderRadius: "20px",
        background: "rgba(0,0,0,0.03)",
    },
    avatar: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: "0.95rem",
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    },
    avatarImg: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    userName: {
        fontWeight: "600",
        fontSize: "0.9rem",
        color: "#333",
        maxWidth: "100px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    dropdownArrow: {
        fontSize: "0.6rem",
        color: "#777",
    },
    dropdownMenu: {
        position: "absolute",
        top: "110%",
        right: 0,
        width: "220px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        border: "1px solid rgba(0,0,0,0.06)",
        padding: "10px 0",
        opacity: 0,
        visibility: "hidden",
        transform: "translateY(10px)",
        transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
    dropdownHeader: {
        padding: "8px 18px",
        fontSize: "0.9rem",
        color: "#333",
    },
    divider: {
        margin: "6px 0",
        border: "none",
        borderBottom: "1px solid #eee",
    },
    dropdownItem: {
        display: "block",
        padding: "10px 18px",
        color: "#555",
        textDecoration: "none",
        fontSize: "0.9rem",
        cursor: "pointer",
    },
    logoutItem: {
        color: "#e74c3c",
        fontWeight: "500",
    }
};

export default Header;