import { useEffect, useRef, useState } from 'react';
import {
    Landmark,
    LayoutDashboard,
    LogOut,
    Mail,
    Package,
    Truck,
    Plus,
    Trash2,
    X,
    LoaderCircle,
    Pencil,
    Image as ImageIcon,
    Star,
    Search,
    Download,
    ShoppingCart,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { statusClass } from '../lib/orderStatus';

export default function AdminDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [messages, setMessages] = useState([]);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    // Total non filtre, pour l'indicateur du tableau de bord.
    const [ordersTotal, setOrdersTotal] = useState(0);
    const [orderSearch, setOrderSearch] = useState('');
    const [orderStatusFilter, setOrderStatusFilter] = useState('');
    const [orderDetail, setOrderDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [carts, setCarts] = useState([]);
    const [cartsDelay, setCartsDelay] = useState(60);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /*
     * --------------------------------------------------------------------------
     * Produits
     * --------------------------------------------------------------------------
     */

    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);
    const [primaryKey, setPrimaryKey] = useState('');

    const [productForm, setProductForm] = useState({
        name: '',
        category: 'lenha',
        sku: '',
        brand: 'LEÑAS CASTOR',
        gtin: '',
        mpn: '',
        description: '',
        price: '',
        is_active: true,
    });

    /*
     * --------------------------------------------------------------------------
     * Image "Qualidade e sustentabilidade"
     * --------------------------------------------------------------------------
     */

    const [qualityImage, setQualityImage] = useState('');
    const [qualityImageFile, setQualityImageFile] = useState(null);
    const [qualityImagePreview, setQualityImagePreview] = useState('');
    const [qualityImageLoading, setQualityImageLoading] = useState(false);
    const [bankForm, setBankForm] = useState({
        holder: 'LEÑAS CASTOR S.L.',
        name: '',
        iban: '',
        bic: '',
    });
    const [savingBank, setSavingBank] = useState(false);
    const [contactForm, setContactForm] = useState({
        email: '',
        phone: '',
        street: '',
        postalCode: '',
        city: '',
        district: '',
        country: 'España',
    });
    const [savingContact, setSavingContact] = useState(false);

    const token = localStorage.getItem('admin_token');

    /*
     * --------------------------------------------------------------------------
     * Chargement initial
     * --------------------------------------------------------------------------
     */

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }

        const storedUser = localStorage.getItem('admin_user');

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error(
                    'Impossible de lire les informations utilisateur.',
                    error
                );
            }
        }

        loadDashboard();
        loadCarts();
    }, []);

    /*
     * Recherche et filtre : on attend une pause de frappe avant d'interroger
     * le serveur. Le premier rendu est ignore, loadDashboard s'en charge.
     */
    const filtersReady = useRef(false);

    useEffect(() => {
        if (!token) {
            return undefined;
        }

        if (!filtersReady.current) {
            filtersReady.current = true;
            return undefined;
        }

        const timer = setTimeout(() => {
            loadOrders(orderSearch.trim(), orderStatusFilter);
        }, 350);

        return () => clearTimeout(timer);
    }, [orderSearch, orderStatusFilter]);

    /*
     * --------------------------------------------------------------------------
     * Charger le dashboard
     * --------------------------------------------------------------------------
     */

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError('');

            /*
             * Charger les produits.
             */
            const productsResponse = await fetch('/api/admin/products', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            if (!productsResponse.ok) {
                throw new Error(
                    'Impossible de charger les produits.'
                );
            }

            const productsData = await productsResponse.json();

            setProducts(productsData);

            /*
             * Charger l'image "Qualidade e sustentabilidade".
             */
            const qualityImageResponse = await fetch(
                '/api/site-content/qualidade-sustentabilidade'
            );

            if (!qualityImageResponse.ok) {
                throw new Error(
                    'Impossible de charger l’image de la section qualité.'
                );
            }

            const qualityImageData =
                await qualityImageResponse.json();

            const imageUrl =
                qualityImageData.data?.image_url || '';

            setQualityImage(imageUrl);
            setQualityImagePreview(imageUrl);

            const ordersResponse = await fetch('/api/admin/orders', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            if (ordersResponse.ok) {
                const ordersData = await ordersResponse.json();
                setOrders(ordersData);
                setOrdersTotal(ordersData.length);
            } else {
                setOrders([]);
                setOrdersTotal(0);
            }

            const bankResponse = await fetch('/api/site-content/bank');

            if (bankResponse.ok) {
                const bankData = await bankResponse.json();
                setBankForm({
                    holder: bankData.holder || 'LEÑAS CASTOR S.L.',
                    name: bankData.name || '',
                    iban: bankData.iban || '',
                    bic: bankData.bic || '',
                });
            }

            const contactResponse = await fetch('/api/site-content/contact');

            if (contactResponse.ok) {
                const contactData = await contactResponse.json();
                setContactForm({
                    email: contactData.email || '',
                    phone: contactData.phone || '',
                    street: contactData.address?.street || '',
                    postalCode: contactData.address?.postalCode || '',
                    city: contactData.address?.city || '',
                    district: contactData.address?.district || '',
                    country: contactData.address?.country || 'España',
                });
            }

            const messagesResponse = await fetch('/api/admin/contact-messages', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            if (messagesResponse.ok) {
                setMessages(await messagesResponse.json());
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    /*
     * --------------------------------------------------------------------------
     * Produits
     * --------------------------------------------------------------------------
     */

    const editProduct = (product) => {
        setEditingProductId(product.id);

        setProductForm({
            name: product.name || '',
            category: product.category || 'lenha',
            sku: product.sku || '',
            brand: product.brand || 'LEÑAS CASTOR',
            gtin: product.gtin || '',
            mpn: product.mpn || '',
            description: product.description || '',
            price: product.price ?? '',
            is_active: Boolean(product.is_active),
        });

        const images = Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : product.image
                ? [{ id: 'legacy', path: product.image, url: product.image.startsWith('http') ? product.image : `/storage/${product.image}`, is_primary: true }]
                : [];

        setExistingImages(images);
        setNewImages([]);
        setDeletedImageIds([]);

        const primary = images.find((image) => image.is_primary) || images[0];
        setPrimaryKey(primary?.id ? `existing-${primary.id}` : '');

        setShowProductForm(true);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleProductChange = (event) => {
        const { name, value, type, checked } = event.target;

        setProductForm((previousForm) => ({
            ...previousForm,
            [name]:
                type === 'checkbox'
                    ? checked
                    : value,
        }));
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) {
            return;
        }

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/jpg',
        ];

        const accepted = [];

        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                setError(
                    'Format d’image non valide. Utilisez JPG, PNG ou WEBP.',
                );
                event.target.value = '';
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError(
                    'Une image dépasse 5 Mo.',
                );
                event.target.value = '';
                return;
            }

            accepted.push({
                file,
                preview: URL.createObjectURL(file),
            });
        }

        setError('');
        setNewImages((current) => {
            const next = [...current, ...accepted].slice(0, 8);

            if (!primaryKey && existingImages.length === 0 && current.length === 0 && next[0]) {
                setPrimaryKey('new-0');
            }

            return next;
        });

        event.target.value = '';
    };

    const removeExistingImage = (imageId) => {
        setExistingImages((current) => {
            const next = current.filter((image) => image.id !== imageId);

            if (primaryKey === `existing-${imageId}`) {
                const fallback = next[0];
                setPrimaryKey(
                    fallback ? `existing-${fallback.id}` : newImages[0] ? 'new-0' : '',
                );
            }

            return next;
        });

        if (imageId !== 'legacy') {
            setDeletedImageIds((current) => [...current, imageId]);
        }
    };

    const removeNewImage = (index) => {
        setNewImages((current) => {
            const next = current.filter((_, itemIndex) => itemIndex !== index);

            if (primaryKey === `new-${index}`) {
                const fallback = existingImages[0];
                setPrimaryKey(
                    fallback
                        ? `existing-${fallback.id}`
                        : next[0]
                            ? 'new-0'
                            : '',
                );
            }

            return next.map((image, itemIndex) => ({
                ...image,
                preview: image.preview,
            }));
        });
    };

    const resetProductForm = () => {
        setProductForm({
            name: '',
            category: 'lenha',
            sku: '',
            brand: 'LEÑAS CASTOR',
            gtin: '',
            mpn: '',
            description: '',
            price: '',
            is_active: true,
        });

        setEditingProductId(null);
        setExistingImages([]);
        setNewImages([]);
        setDeletedImageIds([]);
        setPrimaryKey('');
        setShowProductForm(false);

        const input = document.getElementById(
            'product-image'
        );

        if (input) {
            input.value = '';
        }
    };

    const createProduct = async (event) => {
        event.preventDefault();

        try {
            setError('');

            const isEditing =
                editingProductId !== null;

            const formData = new FormData();

            formData.append(
                'name',
                productForm.name
            );

            formData.append('category', productForm.category || 'lenha');
            formData.append('sku', productForm.sku || '');
            formData.append('brand', productForm.brand || 'LEÑAS CASTOR');
            formData.append('gtin', productForm.gtin || '');
            formData.append('mpn', productForm.mpn || '');

            formData.append(
                'description',
                productForm.description || ''
            );

            formData.append(
                'price',
                productForm.price === ''
                    ? ''
                    : productForm.price
            );

            formData.append(
                'is_active',
                productForm.is_active
                    ? '1'
                    : '0'
            );

            newImages.forEach(({ file }) => {
                formData.append('images[]', file);
            });

            deletedImageIds.forEach((imageId) => {
                formData.append('delete_image_ids[]', imageId);
            });

            if (primaryKey.startsWith('existing-')) {
                formData.append(
                    'primary_image_id',
                    primaryKey.replace('existing-', ''),
                );
            }

            if (primaryKey.startsWith('new-')) {
                formData.append(
                    'primary_new_index',
                    primaryKey.replace('new-', ''),
                );
            }

            /*
             * Laravel + upload :
             * POST + _method=PUT
             */
            if (isEditing) {
                formData.append(
                    '_method',
                    'PUT'
                );
            }

            const url = isEditing
                ? `/api/products/${editingProductId}`
                : '/api/products';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const firstError =
                        Object.values(
                            data.errors
                        )[0][0];

                    throw new Error(firstError);
                }

                throw new Error(
                    data.message ||
                        (isEditing
                            ? 'Impossible de modifier le produit.'
                            : 'Impossible de créer le produit.')
                );
            }

            if (isEditing) {
                setProducts(
                    (previousProducts) =>
                        previousProducts.map(
                            (product) =>
                                product.id ===
                                editingProductId
                                    ? data.data
                                    : product
                        )
                );
            } else {
                setProducts(
                    (previousProducts) => [
                        data.data,
                        ...previousProducts,
                    ]
                );
            }

            resetProductForm();
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const deleteProduct = async (productId) => {
        const confirmed = window.confirm(
            'Voulez-vous vraiment supprimer ce produit ?'
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');

            const response = await fetch(
                `/api/products/${productId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        'Impossible de supprimer le produit.'
                );
            }

            setProducts(
                (previousProducts) =>
                    previousProducts.filter(
                        (product) =>
                            product.id !==
                            productId
                    )
            );
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    /*
     * --------------------------------------------------------------------------
     * Image Qualidade e sustentabilidade
     * --------------------------------------------------------------------------
     */

    const handleQualityImageChange = (
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/jpg',
        ];

        if (!allowedTypes.includes(file.type)) {
            setError(
                'Format d’image non valide. Utilisez JPG, PNG ou WEBP.'
            );

            event.target.value = '';

            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {
            setError(
                'L’image est trop volumineuse. Taille maximale : 5 Mo.'
            );

            event.target.value = '';

            return;
        }

        setError('');

        setQualityImageFile(file);

        const previewUrl =
            URL.createObjectURL(file);

        setQualityImagePreview(
            previewUrl
        );
    };

    const saveQualityImage = async () => {
        if (!qualityImageFile) {
            setError(
                'Veuillez sélectionner une nouvelle image.'
            );

            return;
        }

        try {
            setQualityImageLoading(true);
            setError('');

            const formData =
                new FormData();

            formData.append(
                'image',
                qualityImageFile
            );

            const response =
                await fetch(
                    '/api/site-content/qualidade-sustentabilidade',
                    {
                        method: 'POST',
                        headers: {
                            Accept:
                                'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const firstError =
                        Object.values(
                            data.errors
                        )[0][0];

                    throw new Error(
                        firstError
                    );
                }

                throw new Error(
                    data.message ||
                        'Impossible d’enregistrer l’image.'
                );
            }

            setQualityImage(
                data.data.image_url
            );

            setQualityImagePreview(
                data.data.image_url
            );

            setQualityImageFile(null);

            const input =
                document.getElementById(
                    'quality-section-image'
                );

            if (input) {
                input.value = '';
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setQualityImageLoading(
                false
            );
        }
    };

    const deleteQualityImage =
        async () => {
            const confirmed =
                window.confirm(
                    'Voulez-vous vraiment supprimer l’image de la section qualité ?'
                );

            if (!confirmed) {
                return;
            }

            try {
                setQualityImageLoading(
                    true
                );

                setError('');

                const response =
                    await fetch(
                        '/api/site-content/qualidade-sustentabilidade',
                        {
                            method: 'DELETE',
                            headers: {
                                Accept:
                                    'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            'Impossible de supprimer l’image.'
                    );
                }

                setQualityImage('');
                setQualityImagePreview(
                    ''
                );
                setQualityImageFile(null);

                const input =
                    document.getElementById(
                        'quality-section-image'
                    );

                if (input) {
                    input.value = '';
                }
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setQualityImageLoading(
                    false
                );
            }
        };

    const cancelQualityImageChange =
        () => {
            setQualityImageFile(null);
            setQualityImagePreview(
                qualityImage
            );

            const input =
                document.getElementById(
                    'quality-section-image'
                );

            if (input) {
                input.value = '';
            }
        };

    /*
     * --------------------------------------------------------------------------
     * Déconnexion
     * --------------------------------------------------------------------------
     */

    const logout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error(error);
        }

        localStorage.removeItem(
            'admin_token'
        );

        localStorage.removeItem(
            'admin_user'
        );

        navigate('/admin/login');
    };

    const updateOrderStatus = async (orderId, status) => {
        setUpdatingOrderId(orderId);
        setError('');

        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Impossible de mettre à jour le statut.',
                );
            }

            setOrders((current) =>
                current.map((order) =>
                    order.id === orderId ? data : order,
                ),
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    /**
     * Recharge la liste des commandes en tenant compte de la recherche
     * et du filtre de statut.
     */
    const loadOrders = async (search, status) => {
        const params = new URLSearchParams();

        if (search) params.set('q', search);
        if (status) params.set('status', status);

        try {
            const response = await fetch(
                `/api/admin/orders?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                },
            );

            if (response.ok) {
                setOrders(await response.json());
            }
        } catch {
            // Silencieux : la liste precedente reste affichee.
        }
    };

    const openOrderDetail = async (orderId) => {
        setLoadingDetail(true);
        setError('');

        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Impossible de charger la commande.');
            }

            setOrderDetail(await response.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingDetail(false);
        }
    };

    /**
     * Telecharge le CSV. On passe par un blob : le lien direct ne peut pas
     * porter l'en-tete Authorization.
     */
    const exportOrders = async () => {
        const params = new URLSearchParams();

        if (orderSearch) params.set('q', orderSearch);
        if (orderStatusFilter) params.set('status', orderStatusFilter);

        try {
            const response = await fetch(
                `/api/admin/orders/export?${params.toString()}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            if (!response.ok) {
                throw new Error("L'export a échoué.");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = `pedidos-${new Date()
                .toISOString()
                .slice(0, 10)}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.message);
        }
    };

    const loadCarts = async () => {
        try {
            const response = await fetch('/api/admin/carts', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCarts(Array.isArray(data.carts) ? data.carts : []);
                setCartsDelay(data.abandonedAfterMinutes ?? 60);
            }
        } catch {
            // Section non bloquante.
        }
    };

    const deleteCart = async (cartId) => {
        if (!window.confirm('Supprimer définitivement ce panier ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/carts/${cartId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            if (response.ok) {
                setCarts((current) =>
                    current.filter((cart) => cart.id !== cartId),
                );
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const saveBankDetails = async (event) => {
        event.preventDefault();
        setSavingBank(true);
        setError('');

        try {
            const response = await fetch('/api/site-content/bank', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bankForm),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Impossible d’enregistrer l’IBAN.',
                );
            }

            setBankForm({
                holder: data.holder || bankForm.holder,
                name: data.name || '',
                iban: data.iban || '',
                bic: data.bic || '',
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setSavingBank(false);
        }
    };

    const saveContactDetails = async (event) => {
        event.preventDefault();
        setSavingContact(true);
        setError('');

        try {
            const response = await fetch('/api/site-content/contact', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactForm),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Impossible d’enregistrer les coordonnées.',
                );
            }

            setContactForm({
                email: data.email || contactForm.email,
                phone: data.phone || contactForm.phone,
                street: data.address?.street || contactForm.street,
                postalCode: data.address?.postalCode || contactForm.postalCode,
                city: data.address?.city || contactForm.city,
                district: data.address?.district || contactForm.district,
                country: data.address?.country || contactForm.country,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setSavingContact(false);
        }
    };

    const updateMessageRead = async (messageId, isRead) => {
        try {
            const response = await fetch(
                `/api/admin/contact-messages/${messageId}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ is_read: isRead }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Impossible de modifier le message.');
            }

            setMessages((current) =>
                current.map((message) =>
                    message.id === messageId ? data : message,
                ),
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            const response = await fetch(
                `/api/admin/contact-messages/${messageId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                },
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Impossible de supprimer le message.');
            }

            setMessages((current) =>
                current.filter((message) => message.id !== messageId),
            );
        } catch (err) {
            setError(err.message);
        }
    };

    /*
     * --------------------------------------------------------------------------
     * Loading
     * --------------------------------------------------------------------------
     */

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="flex items-center gap-3 text-green-800">
                    <LoaderCircle
                        size={24}
                        className="animate-spin"
                    />

                    <span className="font-medium">
                        Chargement du dashboard...
                    </span>
                </div>
            </main>
        );
    }

    /*
     * --------------------------------------------------------------------------
     * Interface
     * --------------------------------------------------------------------------
     */

    return (
        <main className="min-h-screen bg-gray-100">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-800 text-white">
                            <LayoutDashboard
                                size={22}
                            />
                        </div>

                        <div>
                            <h1 className="font-bold text-gray-900">
                                LEÑAS CASTOR
                            </h1>

                            <p className="text-sm text-gray-500">
                                Administration
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-semibold text-gray-900">
                                    {user.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {user.email}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={
                                logout
                            }
                            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                        >
                            <LogOut
                                size={17}
                            />

                            Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-6 py-8">
                {error && (
                    <div className="mb-6 flex items-center justify-between rounded-xl bg-red-50 p-4 text-red-700">
                        <span className="text-sm font-medium">
                            {error}
                        </span>

                        <button
                            onClick={() =>
                                setError(
                                    ''
                                )
                            }
                            className="rounded-lg p-1 hover:bg-red-100"
                        >
                            <X
                                size={18}
                            />
                        </button>
                    </div>
                )}

                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
                        Dashboard
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
                        Bienvenue,{' '}
                        {user?.name ||
                            'Admin'}
                    </h2>

                    <p className="mt-2 text-gray-600">
                        Gérez les produits, les
                        images et l'activité de
                        votre site.
                    </p>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* STATISTIQUES */}
                {/* ---------------------------------------------------------------- */}

                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Produits
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {
                                        products.length
                                    }
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                                <Package
                                    size={24}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Messages
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {
                                        messages.length
                                    }
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                <Mail
                                    size={24}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Commandes
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {ordersTotal}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                                <Truck
                                    size={24}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* PRODUITS */}
                {/* ---------------------------------------------------------------- */}

                <section className="mt-10 rounded-2xl bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                Produits
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Gérez les produits
                                présentés sur le
                                site.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                resetProductForm();
                                setShowProductForm(
                                    true
                                );
                            }}
                            className="flex items-center justify-center gap-2 rounded-xl bg-green-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-900"
                        >
                            <Plus
                                size={18}
                            />

                            Nouveau produit
                        </button>
                    </div>

                    {showProductForm && (
                        <div className="border-b bg-gray-50 p-6">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-gray-900">
                                    {editingProductId
                                        ? 'Modifier le produit'
                                        : 'Créer un produit'}
                                </h4>

                                <button
                                    onClick={
                                        resetProductForm
                                    }
                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-200"
                                >
                                    <X
                                        size={18}
                                    />
                                </button>
                            </div>

                            <form
                                onSubmit={
                                    createProduct
                                }
                                className="mt-6 grid gap-5 md:grid-cols-2"
                            >
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                                        Nom
                                    </label>

                                    <input
                                        name="name"
                                        value={
                                            productForm.name
                                        }
                                        onChange={
                                            handleProductChange
                                        }
                                        required
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                        placeholder="Pellets de bois"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                                        Catégorie
                                    </label>
                                    <select
                                        name="category"
                                        value={productForm.category}
                                        onChange={handleProductChange}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                    >
                                        <option value="lenha">Leña</option>
                                        <option value="carbon">Carbón</option>
                                        <option value="pellets">Pellets</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                                        Prix (IVA incluído, EUR)
                                    </label>

                                    <input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        required
                                        value={
                                            productForm.price
                                        }
                                        onChange={
                                            handleProductChange
                                        }
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                        placeholder="5.90"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                                        SKU
                                    </label>
                                    <input
                                        name="sku"
                                        value={productForm.sku}
                                        onChange={handleProductChange}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700"
                                        placeholder="RCK-P-15KG"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                                        Marca
                                    </label>
                                    <input
                                        name="brand"
                                        value={productForm.brand}
                                        onChange={handleProductChange}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                                        GTIN / EAN
                                    </label>
                                    <input
                                        name="gtin"
                                        value={productForm.gtin}
                                        onChange={handleProductChange}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700"
                                        placeholder="Opcional — 8 a 14 dígitos"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                                        MPN
                                    </label>
                                    <input
                                        name="mpn"
                                        value={productForm.mpn}
                                        onChange={handleProductChange}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700"
                                        placeholder="Referência do fabricante"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        rows="4"
                                        value={
                                            productForm.description
                                        }
                                        onChange={
                                            handleProductChange
                                        }
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                        placeholder="Description du produit..."
                                    />
                                </div>

                                {/* IMAGE PRODUIT */}

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                                        Images du produit
                                    </label>

                                    <p className="mb-3 text-sm text-gray-500">
                                        Jusqu’à 8 photos. Cliquez sur l’étoile pour définir l’image principale.
                                    </p>

                                    <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
                                        {existingImages.map((image) => {
                                            const src = image.url || (image.path?.startsWith('http') ? image.path : `/storage/${image.path}`);
                                            const key = `existing-${image.id}`;

                                            return (
                                                <div
                                                    key={key}
                                                    className={`relative overflow-hidden rounded-xl border-2 ${
                                                        primaryKey === key
                                                            ? 'border-green-700'
                                                            : 'border-gray-200'
                                                    }`}
                                                >
                                                    <img
                                                        loading="lazy"
                                                        decoding="async"
                                                        src={src}
                                                        alt=""
                                                        className="h-32 w-full object-cover"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 p-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setPrimaryKey(key)}
                                                            className="rounded bg-white/90 p-1 text-green-800"
                                                            title="Image principale"
                                                        >
                                                            <Star
                                                                size={14}
                                                                fill={primaryKey === key ? 'currentColor' : 'none'}
                                                            />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingImage(image.id)}
                                                            className="rounded bg-red-600 p-1 text-white"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                    {primaryKey === key && (
                                                        <span className="absolute left-2 top-2 rounded bg-green-800 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                            Principale
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {newImages.map((image, index) => {
                                            const key = `new-${index}`;

                                            return (
                                                <div
                                                    key={key}
                                                    className={`relative overflow-hidden rounded-xl border-2 ${
                                                        primaryKey === key
                                                            ? 'border-green-700'
                                                            : 'border-gray-200'
                                                    }`}
                                                >
                                                    <img
                                                        loading="lazy"
                                                        decoding="async"
                                                        src={image.preview}
                                                        alt=""
                                                        className="h-32 w-full object-cover"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 p-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setPrimaryKey(key)}
                                                            className="rounded bg-white/90 p-1 text-green-800"
                                                        >
                                                            <Star
                                                                size={14}
                                                                fill={primaryKey === key ? 'currentColor' : 'none'}
                                                            />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeNewImage(index)}
                                                            className="rounded bg-red-600 p-1 text-white"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                    {primaryKey === key && (
                                                        <span className="absolute left-2 top-2 rounded bg-green-800 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                            Principale
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {existingImages.length + newImages.length < 8 && (
                                            <label
                                                htmlFor="product-image"
                                                className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white text-center"
                                            >
                                                <ImageIcon size={22} className="text-green-700" />
                                                <span className="mt-2 text-xs font-semibold text-gray-700">
                                                    Ajouter
                                                </span>
                                            </label>
                                        )}
                                    </div>

                                    <input
                                        id="product-image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>

                                <label className="flex items-center gap-3 md:col-span-2">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={
                                            productForm.is_active
                                        }
                                        onChange={
                                            handleProductChange
                                        }
                                        className="h-4 w-4 rounded"
                                    />

                                    <span className="text-sm font-medium text-gray-700">
                                        Produit actif
                                    </span>
                                </label>

                                <div className="flex gap-3 md:col-span-2">
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-green-800 px-6 py-3 font-semibold text-white hover:bg-green-900"
                                    >
                                        {editingProductId
                                            ? 'Enregistrer les modifications'
                                            : 'Créer le produit'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            resetProductForm
                                        }
                                        className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="divide-y">
                        {products.length ===
                        0 ? (
                            <div className="p-10 text-center text-gray-500">
                                Aucun produit
                                disponible.
                            </div>
                        ) : (
                            products.map(
                                (product) => (
                                    <div
                                        key={
                                            product.id
                                        }
                                        className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            {(product.images?.[0]?.url || product.image) ? (
                                                <img
                                                    loading="lazy"
                                                    decoding="async"
                                                    src={
                                                        product.images?.find((image) => image.is_primary)?.url
                                                        || product.images?.[0]?.url
                                                        || (product.image.startsWith('http')
                                                            ? product.image
                                                            : `/storage/${product.image}`)
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                    className="h-20 w-20 rounded-xl object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                                                    <ImageIcon
                                                        size={
                                                            25
                                                        }
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-bold text-gray-900">
                                                        {
                                                            product.name
                                                        }
                                                    </h4>

                                                    {product.is_active ? (
                                                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                            Actif
                                                        </span>
                                                    ) : (
                                                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                                                            Inactif
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {product.description ||
                                                        'Aucune description'}
                                                </p>

                                                {product.price !==
                                                    null &&
                                                    product.price !==
                                                        undefined && (
                                                        <p className="mt-2 text-sm font-semibold text-green-700">
                                                            {Number(
                                                                product.price
                                                            ).toFixed(
                                                                2
                                                            )}{' '}
                                                            €
                                                        </p>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    editProduct(
                                                        product
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                                            >
                                                <Pencil
                                                    size={
                                                        17
                                                    }
                                                />

                                                Modifier
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteProduct(
                                                        product.id
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2
                                                    size={
                                                        17
                                                    }
                                                />

                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                )
                            )
                        )}
                    </div>
                </section>

                {/* ---------------------------------------------------------------- */}
                {/* QUALIDADE E SUSTENTABILIDADE */}
                {/* ---------------------------------------------------------------- */}

                <section className="mt-8 rounded-2xl bg-white shadow-sm">
                    <div className="border-b p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                                <ImageIcon
                                    size={21}
                                />
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900">
                                    Qualidade e
                                    sustentabilidade
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Gérez l’image
                                    affichée sur
                                    cette section
                                    du site.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5">
                            {qualityImagePreview ? (
                                <div className="relative">
                                    <img
                                        loading="lazy"
                                        decoding="async"
                                        src={
                                            qualityImagePreview
                                        }
                                        alt="Qualidade e sustentabilidade"
                                        className="h-72 w-full rounded-xl object-cover"
                                    />

                                    {qualityImageFile && (
                                        <button
                                            type="button"
                                            onClick={
                                                cancelQualityImageChange
                                            }
                                            disabled={
                                                qualityImageLoading
                                            }
                                            className="absolute right-3 top-3 rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800 disabled:opacity-50"
                                        >
                                            Annuler
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <label
                                    htmlFor="quality-section-image"
                                    className="flex cursor-pointer flex-col items-center justify-center py-12 text-center"
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
                                        <ImageIcon
                                            size={
                                                26
                                            }
                                        />
                                    </div>

                                    <p className="mt-4 font-semibold text-gray-900">
                                        Choisir
                                        l’image de la
                                        section
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        JPG, PNG ou
                                        WEBP —
                                        maximum 5
                                        Mo
                                    </p>

                                    <span className="mt-4 rounded-xl bg-green-800 px-5 py-2.5 text-sm font-semibold text-white">
                                        Choisir une
                                        image
                                    </span>
                                </label>
                            )}

                            <input
                                id="quality-section-image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={
                                    handleQualityImageChange
                                }
                                className="hidden"
                            />
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <label
                                htmlFor="quality-section-image"
                                className="cursor-pointer rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                            >
                                <span className="flex items-center gap-2">
                                    <ImageIcon
                                        size={
                                            17
                                        }
                                    />

                                    Choisir une
                                    image
                                </span>
                            </label>

                            <button
                                type="button"
                                onClick={
                                    saveQualityImage
                                }
                                disabled={
                                    !qualityImageFile ||
                                    qualityImageLoading
                                }
                                className="rounded-xl bg-green-800 px-5 py-3 text-sm font-semibold text-white hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {qualityImageLoading
                                    ? 'Enregistrement...'
                                    : 'Enregistrer'}
                            </button>

                            {qualityImage && (
                                <button
                                    type="button"
                                    onClick={
                                        deleteQualityImage
                                    }
                                    disabled={
                                        qualityImageLoading
                                    }
                                    className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                >
                                    <span className="flex items-center gap-2">
                                        <Trash2
                                            size={
                                                17
                                            }
                                        />

                                        Supprimer
                                    </span>
                                </button>
                            )}
                        </div>

                        <p className="mt-4 text-xs text-gray-500">
                            L’image actuelle
                            sera
                            automatiquement
                            remplacée lorsque
                            vous enregistrerez
                            une nouvelle image.
                        </p>
                    </div>
                </section>

                {/* ---------------------------------------------------------------- */}
                {/* COORDONNÉES BANCAIRES */}
                {/* ---------------------------------------------------------------- */}

                <section className="mt-8 rounded-2xl bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-800">
                            <Landmark size={21} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">
                                Coordonnées bancaires
                            </h3>
                            <p className="text-sm text-gray-500">
                                Affichées sur la confirmation de commande et
                                dans l’e-mail (IBAN / BIC).
                            </p>
                        </div>
                    </div>
                    <form
                        onSubmit={saveBankDetails}
                        className="grid gap-4 p-6 md:grid-cols-2"
                    >
                        <label className="block text-sm">
                            <span className="mb-1 block font-medium text-gray-700">
                                Titulaire
                            </span>
                            <input
                                value={bankForm.holder}
                                onChange={(event) =>
                                    setBankForm((current) => ({
                                        ...current,
                                        holder: event.target.value,
                                    }))
                                }
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="mb-1 block font-medium text-gray-700">
                                Banque (optionnel)
                            </span>
                            <input
                                value={bankForm.name}
                                onChange={(event) =>
                                    setBankForm((current) => ({
                                        ...current,
                                        name: event.target.value,
                                    }))
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="mb-1 block font-medium text-gray-700">
                                IBAN
                            </span>
                            <input
                                value={bankForm.iban}
                                onChange={(event) =>
                                    setBankForm((current) => ({
                                        ...current,
                                        iban: event.target.value,
                                    }))
                                }
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 font-mono outline-none focus:border-green-700"
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="mb-1 block font-medium text-gray-700">
                                BIC / SWIFT
                            </span>
                            <input
                                value={bankForm.bic}
                                onChange={(event) =>
                                    setBankForm((current) => ({
                                        ...current,
                                        bic: event.target.value,
                                    }))
                                }
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 font-mono outline-none focus:border-green-700"
                            />
                        </label>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={savingBank}
                                className="rounded-xl bg-green-800 px-5 py-3 text-sm font-semibold text-white hover:bg-green-900 disabled:opacity-60"
                            >
                                {savingBank
                                    ? 'Enregistrement…'
                                    : 'Enregistrer l’IBAN'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* ---------------------------------------------------------------- */}
                {/* COORDONNÉES PUBLIQUES */}
                {/* ---------------------------------------------------------------- */}

                <section className="mt-8 rounded-2xl bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <Mail size={21} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">
                                Coordonnées publiques
                            </h3>
                            <p className="text-sm text-gray-500">
                                Affichées sur le site, le footer, la page contact
                                et les pages légales.
                            </p>
                        </div>
                    </div>
                    <form
                        onSubmit={saveContactDetails}
                        className="grid gap-4 p-6 md:grid-cols-2"
                    >
                        <label className="block text-sm">
                            <span className="mb-1 block font-medium text-gray-700">
                                E-mail
                            </span>
                            <input
                                type="email"
                                value={contactForm.email}
                                onChange={(event) =>
                                    setContactForm((current) => ({
                                        ...current,
                                        email: event.target.value,
                                    }))
                                }
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="mb-1 block font-medium text-gray-700">
                                Téléphone
                            </span>
                            <input
                                value={contactForm.phone}
                                onChange={(event) =>
                                    setContactForm((current) => ({
                                        ...current,
                                        phone: event.target.value,
                                    }))
                                }
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                            />
                        </label>
                        <label className="block text-sm md:col-span-2">
                            <span className="mb-1 block font-medium text-gray-700">
                                Adresse
                            </span>
                            <input
                                value={contactForm.street}
                                onChange={(event) =>
                                    setContactForm((current) => ({
                                        ...current,
                                        street: event.target.value,
                                    }))
                                }
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="mb-1 block font-medium text-gray-700">
                                Code postal
                            </span>
                            <input
                                value={contactForm.postalCode}
                                onChange={(event) =>
                                    setContactForm((current) => ({
                                        ...current,
                                        postalCode: event.target.value,
                                    }))
                                }
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="mb-1 block font-medium text-gray-700">
                                Ville
                            </span>
                            <input
                                value={contactForm.city}
                                onChange={(event) =>
                                    setContactForm((current) => ({
                                        ...current,
                                        city: event.target.value,
                                    }))
                                }
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="mb-1 block font-medium text-gray-700">
                                Province
                            </span>
                            <input
                                value={contactForm.district}
                                onChange={(event) =>
                                    setContactForm((current) => ({
                                        ...current,
                                        district: event.target.value,
                                    }))
                                }
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="mb-1 block font-medium text-gray-700">
                                Pays
                            </span>
                            <input
                                value={contactForm.country}
                                onChange={(event) =>
                                    setContactForm((current) => ({
                                        ...current,
                                        country: event.target.value,
                                    }))
                                }
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                            />
                        </label>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={savingContact}
                                className="rounded-xl bg-green-800 px-5 py-3 text-sm font-semibold text-white hover:bg-green-900 disabled:opacity-60"
                            >
                                {savingContact
                                    ? 'Enregistrement…'
                                    : 'Enregistrer les coordonnées'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* ---------------------------------------------------------------- */}
                {/* COMMANDES */}
                {/* ---------------------------------------------------------------- */}

                <section className="mt-8 rounded-2xl bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                            <Truck size={21} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">
                                Commandes
                            </h3>
                            <p className="text-sm text-gray-500">
                                Changez le statut : le client le voit tout de
                                suite sur Seguir mi pedido.
                            </p>
                        </div>
                        <div className="ml-auto flex flex-wrap items-center gap-3 text-xs text-gray-600">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                                En cours
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                Livrée
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                                Annulée
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-b bg-gray-50 px-6 py-4">
                        <div className="relative min-w-[220px] flex-1">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="search"
                                value={orderSearch}
                                onChange={(event) =>
                                    setOrderSearch(event.target.value)
                                }
                                placeholder="N° de commande, e-mail ou nom"
                                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm"
                            />
                        </div>
                        <select
                            value={orderStatusFilter}
                            onChange={(event) =>
                                setOrderStatusFilter(event.target.value)
                            }
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                        >
                            <option value="">Tous les statuts</option>
                            <option value="pending_payment">Pago pendiente</option>
                            <option value="paid">Pago confirmado</option>
                            <option value="preparing">En preparación</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregado</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                        <button
                            type="button"
                            onClick={exportOrders}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <Download size={16} />
                            Exporter CSV
                        </button>
                    </div>

                    {orders.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-500">
                            {orderSearch || orderStatusFilter
                                ? 'Aucune commande ne correspond à cette recherche.'
                                : 'Aucune commande pour le moment.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">
                                            N°
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Client
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Statut
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Détail
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                #{order.number}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">
                                                    {order.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {order.email}
                                                </p>
                                                {order.city ? (
                                                    <p className="text-xs text-gray-400">
                                                        {order.city}
                                                    </p>
                                                ) : null}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                {Number(order.total).toFixed(2)}{' '}
                                                €
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={order.status}
                                                    disabled={
                                                        updatingOrderId ===
                                                        order.id
                                                    }
                                                    onChange={(event) =>
                                                        updateOrderStatus(
                                                            order.id,
                                                            event.target.value,
                                                        )
                                                    }
                                                    className={`rounded-lg border px-3 py-2 text-sm font-semibold ${statusClass(
                                                        order.status,
                                                        'select',
                                                    )}`}
                                                >
                                                    <option value="pending_payment">
                                                        Pago pendiente
                                                    </option>
                                                    <option value="paid">
                                                        Pago confirmado
                                                    </option>
                                                    <option value="preparing">
                                                        En preparación
                                                    </option>
                                                    <option value="shipped">
                                                        Enviado
                                                    </option>
                                                    <option value="delivered">
                                                        Entregado
                                                    </option>
                                                    <option value="cancelled">
                                                        Cancelado
                                                    </option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openOrderDetail(order.id)
                                                    }
                                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    Voir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* ---------------------------------------------------------------- */}
                {/* PANIERS ABANDONNÉS */}
                {/* ---------------------------------------------------------------- */}

                <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="flex items-center gap-3 p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                            <ShoppingCart size={21} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">
                                Paniers abandonnés
                            </h3>
                            <p className="text-sm text-gray-500">
                                Paniers non convertis, sans activité depuis plus
                                de {cartsDelay} minutes.
                            </p>
                        </div>
                    </div>

                    {carts.length === 0 ? (
                        <div className="p-6 pt-0 text-sm text-gray-500">
                            Aucun panier abandonné pour le moment.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Contenu
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Montant
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Dernière activité
                                        </th>
                                        <th className="px-6 py-3" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {carts.map((cart) => (
                                        <tr
                                            key={cart.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-6 py-4">
                                                {cart.contactable ? (
                                                    <>
                                                        <p className="font-medium text-gray-900">
                                                            {cart.name ||
                                                                'Sans nom'}
                                                        </p>
                                                        <a
                                                            href={`mailto:${cart.email}`}
                                                            className="text-xs text-emerald-700 underline"
                                                        >
                                                            {cart.email}
                                                        </a>
                                                    </>
                                                ) : (
                                                    <span className="text-xs italic text-gray-400">
                                                        Visiteur anonyme
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {cart.items
                                                    .map(
                                                        (item) =>
                                                            `${item.quantity} × ${item.name}`,
                                                    )
                                                    .join(', ')}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {Number(cart.subtotal).toFixed(2)}{' '}
                                                €
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {cart.lastActivityAt
                                                    ? new Date(
                                                          cart.lastActivityAt,
                                                      ).toLocaleString('fr-FR')
                                                    : '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteCart(cart.id)
                                                    }
                                                    title="Supprimer ce panier"
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* ---------------------------------------------------------------- */}
                {/* MESSAGES */}
                {/* ---------------------------------------------------------------- */}

                <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <Mail
                                size={21}
                            />
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900">
                                Messages
                            </h3>

                            <p className="text-sm text-gray-500">
                                Les messages reçus
                                depuis le
                                formulaire de
                                contact.
                            </p>
                        </div>
                    </div>

                    {messages.length === 0 ? (
                        <div className="mt-6 rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
                            Aucun message reçu pour le moment.
                        </div>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {messages.map((message) => (
                                <article
                                    key={message.id}
                                    className="rounded-xl border border-gray-200 p-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {message.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {message.email}
                                                {message.phone
                                                    ? ` · ${message.phone}`
                                                    : ''}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateMessageRead(
                                                        message.id,
                                                        !message.is_read,
                                                    )
                                                }
                                                className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                                                    message.is_read
                                                        ? 'bg-gray-100 text-gray-600'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}
                                            >
                                                {message.is_read
                                                    ? 'Marquer non lu'
                                                    : 'Marquer lu'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteMessage(message.id)
                                                }
                                                className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                                aria-label="Supprimer le message"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-700">
                                        {message.message}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* FICHE COMMANDE */}
            {/* ---------------------------------------------------------------- */}

            {loadingDetail ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <LoaderCircle
                        size={32}
                        className="animate-spin text-white"
                    />
                </div>
            ) : null}

            {orderDetail ? (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4"
                    onClick={() => setOrderDetail(null)}
                >
                    <div
                        className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <header className="flex items-start justify-between border-b p-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Commande #{orderDetail.number}
                                </h3>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span
                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(
                                            orderDetail.status,
                                            'badge',
                                        )}`}
                                    >
                                        <span
                                            className={`h-2 w-2 rounded-full ${statusClass(
                                                orderDetail.status,
                                                'dot',
                                            )}`}
                                        />
                                        {orderDetail.statusLabel}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {orderDetail.createdAt
                                            ? new Date(
                                                  orderDetail.createdAt,
                                              ).toLocaleString('fr-FR')
                                            : '—'}
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOrderDetail(null)}
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                                aria-label="Fermer"
                            >
                                <X size={20} />
                            </button>
                        </header>

                        <div className="grid gap-6 p-6 sm:grid-cols-2">
                            <div>
                                <h4 className="text-xs font-semibold uppercase text-gray-500">
                                    Client
                                </h4>
                                <p className="mt-2 font-medium text-gray-900">
                                    {orderDetail.customer.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <a
                                        href={`mailto:${orderDetail.customer.email}`}
                                        className="text-emerald-700 underline"
                                    >
                                        {orderDetail.customer.email}
                                    </a>
                                </p>
                                {orderDetail.customer.phone ? (
                                    <p className="text-sm text-gray-600">
                                        <a
                                            href={`tel:${orderDetail.customer.phone}`}
                                            className="text-emerald-700 underline"
                                        >
                                            {orderDetail.customer.phone}
                                        </a>
                                    </p>
                                ) : null}
                                {orderDetail.customer.nif ? (
                                    <p className="mt-1 text-sm text-gray-600">
                                        NIF : {orderDetail.customer.nif}
                                    </p>
                                ) : null}
                                {orderDetail.customer.company ? (
                                    <p className="text-sm text-gray-600">
                                        {orderDetail.customer.company}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold uppercase text-gray-500">
                                    Livraison
                                </h4>
                                <p className="mt-2 text-sm leading-6 text-gray-700">
                                    {orderDetail.address.street}
                                    {orderDetail.address.address2
                                        ? `, ${orderDetail.address.address2}`
                                        : ''}
                                    <br />
                                    {orderDetail.address.postalCode}{' '}
                                    {orderDetail.address.city}
                                    <br />
                                    {orderDetail.address.district},{' '}
                                    {orderDetail.address.country}
                                </p>
                                <p className="mt-2 text-xs text-gray-500">
                                    {orderDetail.shipping.detail}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Livraison estimée :{' '}
                                    {orderDetail.shipping.estimatedDelivery}
                                </p>
                            </div>
                        </div>

                        <div className="border-t px-6 py-4">
                            <h4 className="text-xs font-semibold uppercase text-gray-500">
                                Articles
                            </h4>
                            <ul className="mt-3 divide-y">
                                {orderDetail.items.map((item, index) => (
                                    <li
                                        key={`${item.id}-${index}`}
                                        className="flex items-center gap-3 py-3"
                                    >
                                        {item.image ? (
                                            <img
                                                loading="lazy"
                                                decoding="async"
                                                src={item.image}
                                                alt=""
                                                className="h-12 w-12 rounded-lg object-cover"
                                            />
                                        ) : null}
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.quantity} ×{' '}
                                                {item.price.toFixed(2)} €
                                            </p>
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            {item.lineTotal.toFixed(2)} €
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-t px-6 py-4 text-sm">
                            <div className="flex justify-between py-1 text-gray-600">
                                <span>Sous-total</span>
                                <span>
                                    {orderDetail.totals.subtotal.toFixed(2)} €
                                </span>
                            </div>
                            <div className="flex justify-between py-1 text-gray-600">
                                <span>
                                    Livraison ({orderDetail.shipping.label})
                                </span>
                                <span>
                                    {orderDetail.totals.shipping.toFixed(2)} €
                                </span>
                            </div>
                            <div className="flex justify-between py-1 text-gray-600">
                                <span>TVA incluse</span>
                                <span>
                                    {orderDetail.totals.tax.toFixed(2)} €
                                </span>
                            </div>
                            <div className="mt-2 flex justify-between border-t pt-3 text-base font-bold text-gray-900">
                                <span>Total</span>
                                <span>
                                    {orderDetail.totals.total.toFixed(2)} €
                                </span>
                            </div>
                            <p className="mt-3 text-xs text-gray-500">
                                Paiement : {orderDetail.payment.label}
                            </p>
                        </div>

                        <footer className="flex flex-wrap items-center justify-between gap-3 border-t bg-gray-50 px-6 py-4">
                            <a
                                href={orderDetail.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-emerald-700 underline"
                            >
                                Voir la page de suivi du client
                            </a>
                            <button
                                type="button"
                                onClick={() => setOrderDetail(null)}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                            >
                                Fermer
                            </button>
                        </footer>
                    </div>
                </div>
            ) : null}
        </main>
    );
}
