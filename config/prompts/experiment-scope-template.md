# Experiment Scope

> Template — salin ke `<project>/ai/experiments/EXPERIMENT_SCOPE.md` per fase eksperimen aktif.
> Scope ini adalah **hard execution boundary** untuk Quant Analyst (Qwen 3.8 Max).

## Current Objective
Improve robustness of the current simple trading model.

## Current Phase
Initial tuning / focused tuning / walk-forward / promotion gate / etc.

## Active Features
- volatility
- trend
- volume

## Tunable Parameters
- volatility_window: [60, 80, 120]
- trend_window: [20, 40, 60]

## Tunable Rules
- change one major factor at a time unless explicitly allowed
- keep model family fixed
- preserve label definition

## Fixed Parameters
- model_type: XGBoost
- label_horizon: 15m
- confidence_threshold: 0.70

## Explicitly Out of Scope
- new feature families
- order-book imbalance
- funding-rate features
- new model architectures
- ensemble models
- alternative labels

## Deferred Ideas
- order-book imbalance
- funding rate
- transformer-based model

## Current Philosophy
Stay simple first.
Validate the current feature/model set before adding complexity.

## Promotion Criteria
- ...
