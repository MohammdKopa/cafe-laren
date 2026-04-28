/**
 * Bloom modal silhouettes — one per menu section. Each is a single SVG
 * `path d` string sized in its viewBox so the BloomModal can paint it
 * at any scale.
 *
 * Adding a new section? Define its silhouette here and reference it
 * from the section component.
 */
import type { BloomSilhouette } from "@/components/BloomModal";

/** Fluted sundae glass — wide flared rim, tapered bowl, narrow stem, wide foot. */
export const SUNDAE_GLASS: BloomSilhouette = {
  viewBox: "0 0 200 240",
  path: `
    M 100 2
    C 80 2 70 4 60 6
    L 18 14
    C 14 16 12 20 14 24
    L 58 96
    C 62 104 66 110 70 122
    L 78 156
    C 80 162 80 168 78 174
    L 70 198
    C 68 204 62 208 56 210
    L 38 218
    C 34 220 32 224 34 228
    C 36 232 40 234 44 234
    L 156 234
    C 160 234 164 232 166 228
    C 168 224 166 220 162 218
    L 144 210
    C 138 208 132 204 130 198
    L 122 174
    C 120 168 120 162 122 156
    L 130 122
    C 134 110 138 104 142 96
    L 186 24
    C 188 20 186 16 182 14
    L 140 6
    C 130 4 120 2 100 2
    Z
  `.replace(/\s+/g, " ").trim(),
};

/** Triple-stack scoop — three rounded scoops on a cone base, kissed peak. Default. */
export const TRIPLE_SCOOP: BloomSilhouette = {
  viewBox: "0 0 200 260",
  path: `
    M 100 8
    C 78 8 64 22 64 42
    C 60 40 52 38 44 42
    C 28 50 22 70 32 86
    C 22 88 12 100 12 116
    C 12 134 28 148 48 148
    C 50 152 54 156 60 158
    L 60 200
    L 140 200
    L 140 158
    C 146 156 150 152 152 148
    C 172 148 188 134 188 116
    C 188 100 178 88 168 86
    C 178 70 172 50 156 42
    C 148 38 140 40 136 42
    C 136 22 122 8 100 8
    Z
    M 60 200
    L 80 252
    L 120 252
    L 140 200
    Z
  `.replace(/\s+/g, " ").trim(),
};

/** Turkish çay (tea) glass — narrow waist with flared rim and base. */
export const CAY_GLASS: BloomSilhouette = {
  viewBox: "0 0 200 260",
  path: `
    M 60 10
    C 60 6 64 4 68 4
    L 132 4
    C 136 4 140 6 140 10
    L 138 18
    C 138 24 134 30 130 36
    C 126 44 120 54 116 64
    C 112 78 110 92 112 106
    C 114 118 118 128 124 138
    C 132 152 138 166 134 180
    C 130 196 116 208 100 208
    C 84 208 70 196 66 180
    C 62 166 68 152 76 138
    C 82 128 86 118 88 106
    C 90 92 88 78 84 64
    C 80 54 74 44 70 36
    C 66 30 62 24 62 18
    Z
    M 70 240
    L 130 240
    C 136 240 140 244 140 250
    C 140 254 136 258 130 258
    L 70 258
    C 64 258 60 254 60 250
    C 60 244 64 240 70 240
    Z
    M 90 208
    L 110 208
    L 110 240
    L 90 240
    Z
  `.replace(/\s+/g, " ").trim(),
};

/** Golden-sun disc — 12-point sunburst. The brand mark itself, used on
 *  the Aktionen / deals section bloom. */
export const SUN_DISC: BloomSilhouette = {
  viewBox: "0 0 240 240",
  path: `
    M 120 0
    L 132 56
    L 174 18
    L 162 74
    L 222 66
    L 184 110
    L 240 120
    L 184 130
    L 222 174
    L 162 166
    L 174 222
    L 132 184
    L 120 240
    L 108 184
    L 66 222
    L 78 166
    L 18 174
    L 56 130
    L 0 120
    L 56 110
    L 18 66
    L 78 74
    L 66 18
    L 108 56
    Z
  `.replace(/\s+/g, " ").trim(),
};

/** Soft-serve swirl — tower with horizontal ridges, peaked tip. */
export const SOFT_SERVE: BloomSilhouette = {
  viewBox: "0 0 200 280",
  path: `
    M 100 8
    C 92 8 86 12 84 18
    C 76 22 70 28 70 36
    C 60 40 56 50 60 60
    C 52 64 48 74 52 84
    C 44 88 40 100 46 110
    C 38 114 34 126 42 138
    C 34 144 32 156 42 166
    C 34 172 32 184 44 194
    C 36 200 36 212 48 220
    C 42 226 44 238 58 244
    L 58 252
    C 58 260 64 264 72 264
    L 128 264
    C 136 264 142 260 142 252
    L 142 244
    C 156 238 158 226 152 220
    C 164 212 164 200 156 194
    C 168 184 166 172 158 166
    C 168 156 166 144 158 138
    C 166 126 162 114 154 110
    C 160 100 156 88 148 84
    C 152 74 148 64 140 60
    C 144 50 140 40 130 36
    C 130 28 124 22 116 18
    C 114 12 108 8 100 8
    Z
  `.replace(/\s+/g, " ").trim(),
};
