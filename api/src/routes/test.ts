import { Router } from 'express';

const router = Router(); // create new router instance

// GET /test
router.get('/', (req, res) => {
  res.json({
    message: 'Hello from the test route!',
    timestamp: new Date().toISOString()
  });
});

router.get('/echo', (req, res) => {
    const { name } = req.query; // get name from query parameters
  res.json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString()
  });
});

export default router;