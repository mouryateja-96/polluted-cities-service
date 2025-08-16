import express from 'express';
import { getPollutedCities } from '../services/citiesService.js';

const router = express.Router();

/**
 * GET /cities
 * Query params:
 *  - page (default 1)
 *  - limit (default 10, max 100)
 *  - country (optional) to filter by country name
 */
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const country = req.query.country ? String(req.query.country) : undefined;

    const result = await getPollutedCities({ page, limit, country });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
