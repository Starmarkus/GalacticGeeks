// JavaScript source code
// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userRef = db.collection('users').doc(email);
        if (await userRef.get().exists()) {
            res.status(400).json({ error: 'User already exists' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await userRef.set({
                name,
                email,
                password: hashedPassword,
            });
            res.status(201).json({ message: 'User registered successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login user and generate JWT token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userRef = db.collection('users').doc(email);
        const userSnap = await userRef.get();
        if (!userSnap.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userSnap.data();
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});