---
layout: post
date: 2025-08-15 07:59:00-0400
title: Had the chance to present my recent progress on single-cell TWAS at the ENCORE Lab meeting! 🙌
inline: false
related_posts: false

---

> **TL;DR.**  
> Distance-based latent position models are invariant to Euclidean isometries, so each subject’s latent coordinates are only identified up to rotations, reflections, and translations. In MCMC this shows up as slow, drifting chains and incoherent cross-subject summaries.  
>  
> This note describes a **two-stage Procrustes alignment** that:
> 1. Stabilizes each subject’s chain by “pinning” it to a fixed orientation, and  
> 2. Puts all subjects into one common coordinate frame via a single global orthogonal map (or a generalized Procrustes consensus).

---

## 1. Background: Latent Space + Distance-Based Likelihood

We index **subjects** by \(i = 1,\dots,p\) and **nodes/voxels** by \(k,\ell \in \{1,\dots,n\}\).

For subject \(i\):

- Latent coordinates:  
  \[
  X_i = [X_{i1},\dots,X_{in}] \in \mathbb{R}^{r \times n},
  \]
- Pairwise Euclidean distances:  
  \[
  d_{ik\ell} = \| X_{ik} - X_{i\ell} \|_2,
  \]
- Observed (symmetrized) edge indicator:  
  \[
  v_{ik\ell} \in \{0,1\}.
  \]

A simple example is the **logistic distance model**:
\[
\Pr(v_{ik\ell} = 1 \mid X_i,\alpha)
= \frac{\exp(\eta_{ik\ell})}{1+\exp(\eta_{ik\ell})},\qquad
\eta_{ik\ell} = \alpha_k + \alpha_\ell - d_{ik\ell},
\]
with voxel-specific intercepts \(\{\alpha_k\}\) (assumed subject-invariant here for simplicity).

The key structural property:

> **Distance-based likelihood.**  
> The likelihood depends on \(X_i\) **only** through the set of pairwise distances  
> \(\{d_{ik\ell}\}_{k,\ell}\).  
>  
> Everything in this note applies to any model of that form, not just the logistic example.

---

## 2. Shapes, Isometries, and Nonidentifiability

### 2.1 Configuration vs. Shape

A configuration is a matrix \(X \in \mathbb{R}^{r \times n}\). We act on it by Euclidean isometries:

- Orthogonal transforms \(R \in \mathcal{O}(r)\) (rotations / reflections),
- Translations \(t \in \mathbb{R}^r\).

An isometry acts as:
\[
X \mapsto RX + t\mathbf{1}_n^{\top}.
\]

Two configurations \(X, X'\) are **equivalent** if one can be obtained from the other by such an isometry. The **shape** of \(X\) is the equivalence class \([X]\) under this relation. Equivalently:

> **Shape = distance matrix.**  
> The shape of \(X\) is completely determined by the squared distance matrix  
> \(D(X) = (d_{k\ell}^2)_{k,\ell}\).

### 2.2 Likelihood invariance

Because distances are invariant under isometries:

- If \(X_i' = R X_i + t\mathbf{1}_n^{\top}\), then \(d_{ik\ell}' = d_{ik\ell}\) for all \(k,\ell\),
- Hence **any** distance-based likelihood satisfies:
  \[
  L(X_i) = L(R X_i + t\mathbf{1}_n^{\top}).
  \]

So each subject’s latent coordinates \(X_i\) are **only identified up to isometries**: the posterior is supported on an entire orbit of geometrically equivalent configurations.

---

## 3. A Mild Cross-Subject Structure: Approximate Shared Shape

Instead of putting a parametric mean model on the coordinates, we assume only that subjects share an approximate **common shape** up to isometries and small perturbations.

> **Assumption (Approximate shared shape).**  
> There exists a template configuration \(T \in \mathbb{R}^{r \times n}\) and, for each subject \(i\), an isometry \((O_i, b_i)\) with \(O_i \in \mathcal{O}(r), b_i \in \mathbb{R}^r\) such that
> \[
> X_i = O_i T + b_i \mathbf{1}_n^{\top} + E_i, \qquad \|E_i\|_F \ \text{small}.
> \]
> 
> Geometrically: all subjects live near the same orbit of \(T\) under Euclidean isometries.

No parametric structure on \(T\) is imposed; all we use is this **“same shape up to isometry”** assumption.

---

## 4. What Goes Wrong Without Alignment?

Because the likelihood is isometry-invariant, the posterior is also invariant. This leads to two practical problems.

### (a) Within-subject MCMC drift

Even for a single subject \(i\):

- The posterior over \(X_i\) is flat along orbits of rotations, reflections, and translations.
- An ergodic sampler is free to **wander around this orbit**.

Consequences:

1. Monte Carlo averages of non–isometry-invariant functionals  
   (raw coordinates, axis-specific loadings, etc.) become **unstable** and can be heavily attenuated.
2. Credible regions inflate and visualizations blur, because successive draws come in misaligned orientations.
3. Node-level summaries that implicitly assume a fixed global frame (e.g., coordinate-wise means) become **non-informative**.

### (b) Across-subject incoherence

Across subjects, each \(X_i\) may be realized under its own isometry \((O_i, b_i)\). Then:

- Raw coordinates from different subjects are **not directly comparable**.
- Cross-subject estimators that pool unaligned coordinates (group means, covariance, regressions on \(X_i\), etc.) suffer from extra **orientation noise**.
- This can introduce bias (e.g., shrinkage toward symmetric configurations) and inflate variance.
- Group-level clustering or template estimation can average incompatible geometries and **fail to recover any meaningful shared structure**.

**Moral:** if we care about comparing latent positions across subjects, we must explicitly **remove subject-specific isometries** before summarizing or visualizing.

---

## 5. Two-Stage Procrustes Alignment

We now describe a concrete two-stage alignment pipeline.

Let \(X_i^{(t)}\) denote MCMC draws for subject \(i\) at iteration \(t\).

### 5.1 Stage I: Per-Subject Baselines + Procrustes to a Reference

1. **Compute a short baseline average** for each subject:
   \[
   X_{0i} = \frac{1}{m}\sum_{t=T-m+1}^T X_i^{(t)}.
   \]

2. **Center** each baseline to remove translations:
   \[
   \bar x_{0i} = \frac{1}{n}X_{0i}\mathbf{1}_n,\qquad
   X_{0i} \leftarrow X_{0i} - \bar x_{0i} \mathbf{1}_n^{\top}.
   \]

3. **Pick a reference subject**, say \(i=1\).

4. For each \(i = 2,\dots,p\), solve the **orthogonal Procrustes problem**:
   \[
   R_i^\star = \arg\min_{R \in \mathcal{O}(r)} \|X_{01} - R X_{0i}\|_F,
   \qquad
   \widetilde X_{0i} = R_i^\star X_{0i},\quad \widetilde X_{01} = X_{01}.
   \]

The solution has the usual SVD form:

> **Orthogonal Procrustes solution.**  
> Let
> \[
> X_{01} X_{0i}^{\top} = U \operatorname{diag}(\sigma) V^{\top}
> \]
> be the SVD. Then the minimizer is
> \[
> R_i^\star = U V^{\top}.
> \]

After Stage I, all subject baselines \(\{\widetilde X_{0i}\}\) are in **rough alignment** with subject 1.

---

### 5.2 Stage II: Within-Iteration Forced Alignment (Hoff-style)

Stage II stabilizes the **entire chain** for each subject, not just the baselines.

Fix a centered baseline \(X_{0i}^\star\) for each subject (e.g., its Stage I aligned baseline). At iteration \(t\):

1. Center the current draw:
   \[
   X_i^{(t)} \leftarrow X_i^{(t)} - \bar x_i^{(t)} \mathbf{1}_n^{\top},
   \quad
   \bar x_i^{(t)} = \frac{1}{n}X_i^{(t)}\mathbf{1}_n.
   \]

2. Compute the Procrustes alignment:
   \[
   Q_i^{(t)} = \arg\min_{Q \in \mathcal{O}(r)} \|X_{0i}^\star - Q X_i^{(t)}\|_F.
   \]

   Again via SVD:
   \[
   X_{0i}^\star X_i^{(t)\top} = U_i^{(t)} \Sigma_i^{(t)} V_i^{(t)\top},\qquad
   Q_i^{(t)} = U_i^{(t)} V_i^{(t)\top}.
   \]

3. **Update the aligned draw**:
   \[
   \widetilde X_i^{(t)} = Q_i^{(t)} X_i^{(t)}.
   \]

You can treat \(\widetilde X_i^{(t)}\) as post-processed samples (for inference and visualization), or **overwrite the chain** in-place by setting \(X_i^{(t+1)} \leftarrow \widetilde X_i^{(t)}\).

> **Important:**  
> - The map \(X_i^{(t)} \mapsto \widetilde X_i^{(t)}\) is an isometry, so all pairwise distances and any distance-based likelihood are preserved.  
> - As a post-processing step, it leaves the posterior unchanged.  
> - As an in-place update, it preserves the target distribution because the posterior is itself orthogonally symmetric.

---

## 6. Shared-Map Alignment in Simulations

For simulations with known ground truth, we can go one step further and estimate a **single global orthogonal map** that aligns all subjects to their true latent positions.

Suppose we have:

- Ground-truth latent positions \(X_{\mathrm{true}, i}\) for each subject (already centered and in a common frame),
- Stage I aligned baselines \(R_i X_{0i}\).

We estimate a **shared map** \(RR \in \mathcal{O}(r)\) via:
\[
RR^\star = \arg\min_{RR \in \mathcal{O}(r)} \sum_{i=1}^p \|X_{\mathrm{true}, i} - RR (R_i X_{0i})\|_F^2.
\]

This again has a closed form:

\[
S = \sum_{i=1}^p X_{\mathrm{true}, i} (R_i X_{0i})^{\top}
= U \operatorname{diag}(\sigma) V^{\top},\qquad
RR^\star = U V^{\top}.
\]

- Apply \(RR^\star\) to all pre-aligned baselines: \(RR^\star (R_i X_{0i})\).
- This aligns all subjects to their truth **in a single step**.

Under the shared-shape model \(X_{\mathrm{true}, i} = O_i T\) and small baseline errors \(E_i\), the shared map is **stable**:

> **Shared-map stability (informal).**  
> Assume \(T\) is centered and has full row-rank (\(\sigma_r(T) > 0\)), and after Stage I:
> \[
> R_i X_{0i} = O_i T + E_i.
> \]
> Then the shared minimizer \(RR^\star\) satisfies
> \[
> \frac{1}{p} \sum_{i=1}^p
> \|X_{\mathrm{true}, i} - RR^\star (R_i X_{0i})\|_F
> \;\lesssim\; \bar\varepsilon,
> \quad
> \bar\varepsilon = \frac{1}{p} \sum_{i=1}^p \|E_i\|_F,
> \]
> with constants depending only on \(\sigma_r(T)\). If \(E_i \equiv 0\), then \(RR^\star\) perfectly aligns all subjects (up to a global rotation/reflection).

The proof is a straightforward SVD perturbation argument: compare
\(\sum_i X_{\mathrm{true}, i}(R_i X_{0i})^\top\) to its noiseless version
\(\sum_i O_i T T^\top O_i^\top\) and invoke standard spectral bounds.

---

## 7. Using the Aligned Chain: Nonparametric Cross-Subject Summaries

After running Stage II for all iterations:

- We have aligned draws \(\{\widetilde X_i^{(t)}\}_{t, i}\),
- All subjects live in a **common coordinate system**,
- Distances and the original likelihood are unchanged.

This enables a host of **nonparametric cross-subject summaries**:

- **Voxel-wise summaries across subjects**
  - Fréchet means of voxel positions,
  - Cross-subject variability of voxel locations in latent space.
- **Pooled clustering**
  - Cluster voxels using all subjects’ aligned draws,
  - Or cluster subjects by their latent shapes.
- **Latent-space centrality and geometry**
  - Define centrality measures or distances in latent space and compare across subjects.
- **Downstream regression / correlation**
  - Regress clinical traits or biomarkers on aligned latent coordinates,
  - Study how individual variation in latent shape relates to outcomes.

All of this is now well-defined because orientations have been standardized.

---

## 8. “What Still Needs Proof?” – Theoretical To-Do List

This note deliberately focuses on the geometry and algorithm. The following are natural theoretical targets:

1. **Distance / likelihood invariance**  
   Formal proof that centering and orthogonal maps preserve pairwise distances and thus any distance-based likelihood.

2. **Stage I Procrustes solution**  
   Derive the SVD solution \(R_i^\star = UV^\top\) via a trace maximization argument.

3. **Stage II forced alignment**
   - Show that the Procrustes solution \(Q_i^{(t)}\) is the unique orthogonal minimizer (the polar factor).
   - Prove that applying \(Q_i^{(t)}\) as post-processing leaves posterior summaries unchanged.
   - Prove that in-place updates preserve the target distribution under orthogonal symmetry.

4. **Consistency under shared shape**
   - Under Assumption (approximate shared shape) with vanishing perturbations,
   - Show that the combination of Stage I + Stage II (or a generalized Procrustes mean across subjects) consistently recovers the template shape \([T]\), up to a global orthogonal map.

These results would turn the alignment procedure from “good practice” into a **well-justified geometric correction** for multi-subject latent position models.

---

## 9. Takeaways

- Distance-based latent position models are inherently **nonidentifiable up to isometries**.
- This nonidentifiability is not just a formal annoyance—it actively harms MCMC stability and cross-subject comparability.
- A simple, fully geometric two-stage Procrustes alignment:
  1. **Stage I:** Aligns subject baselines to a common reference;
  2. **Stage II:** Enforces a fixed orientation at every MCMC iteration.
- Because we only ever apply **isometries**, the original likelihood is untouched, but posterior summaries become **stable, interpretable, and comparable** across subjects.

This is meant as a living **research note**: a practical recipe plus a list of theoretical questions I’d like to clean up. If you find it useful or spot gaps/variants I should consider, feel free to reach out or suggest extensions.

