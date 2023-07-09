---
sidebar_position: 1
sidebar_label: Pricing
---

# Pricing

At Xata, we provide transparent and flexible pricing options that cater to the unique needs of all users. Our [pricing page](https://xata.io/pricing) offers a range of plans designed to accommodate all projects, from small personal projects to enterprise applications. With our tiered pricing structure, you can choose the plan that aligns perfectly with your requirements, ensuring that you pay only for what you need. 


## Unit capacity

A single billing unit at Xata comes with the following capacity:

- **Number of records:** 250,000
- **Rate limit:** 25 requests per second
- **Concurrency limit:** 10 requests
- **Data size:** 5 GB
- **AI questions:** 250
- **Branches:** 5


### Discounts at scale

Xata offers volume-based discounts, providing a more cost-effective pricing structure for users who require more units.

Unit costs (per month):

| Units          | Cost per unit |
|----------------|-------------- |
| 0-3            | $0 (free tier)|
| 4-100          | $8 per unit   |
| 101-500        | $7 per unit   | 
| 501-10,000     | $5 per unit   |


## Pricing metrics

To ensure clarity and consistency, the following definitions and enforcement mechanisms are in place when determining billing:

- **Number of records**: The total number of records in all tables within a database.
- **Rate limit**: The maximum number of requests allowed per second.
- **Concurrency limit:** The maximum parallel requests, including transactional, replicas, and search/analytics store types.
- **Data size:** The size of data on disk in the transactional store.
- **AI questions:** The total number of non-error `/ask` endpoint queries made within one month.
- **Branches:** The total number of branches you can create per database.


### Number of records

This refers to the cumulative count of data entries across all tables within your Xata database and is a guideline for your database usage. While it is not strictly enforced in real-time, exceeding this soft limit may trigger a proactive response from Xata.

If you surpass the specified limit, we will reach out to you to discuss your database usage. This communication allows us to better understand your needs and ensure that your database remains optimized and performs efficiently. We can provide guidance, explore potential adjustments to your database configuration, or discuss options for scaling up your resources to ensure you receive the best possible experience with Xata.


### Rate limit

The maximum number of requests allowed per second defines the rate limit. This ensures reliability, stability, and prevents overwhelming resource usage, in order to maintain optimal performance. 

When the rate limit is exceeded, measures are implemented to manage the excess load. In cases where the rate of incoming requests significantly surpasses the limit, the system may reject additional requests.


### Concurrency limit

The maximum number of requests allowed in parallel refers to the limit on the number of simultaneous requests that can be processed at any given time for each specific store type.

Each store type (consistent transactional, read replicas, and search/analytics) has a limit on the number of requests that can be processed simultaneously. For the different store types, there are specific allocation guidelines. Out of a total of 10 concurrent requests per unit, the following allocations apply:

 - **Consistent transactional store** - 2 requests
 - **Read replicas store** - 3 requests 
 - **Search/analytics engine** - 5 requests  
 
These allocations are designed to prioritize and balance the workload across the different store types based on requirements and usage patterns.


### Data Size 

The data size on disk denotes the quantity of data held within the transactional database.

This size limit is considered a soft-limit and is not strictly enforced in real-time. However, if you exceed this limit, it indicates that your data storage requirements may be approaching a critical level. In such cases, we recommend you explore potential solutions with [Xata Support](https://support.xata.io/hc/en-us) to optimize and scale your data storage. 


### AI questions

This metric refers to the count of successful and valid requests sent to the `/ask` endpoint within a month. The count for non-error queries resets at the end of each calendar month.


### Branches

This metric refers to the total number of branches you can create within a single database. While billing units are assigned to each individual branch, the limit on the number of branches is enforced at the database level. 

You have the flexibility to create multiple branches within a database, and each branch can have its own designated billing associated with it. There is a maximum limit on the total number of branches that can exist within the database.


#### Calculating branches

To determine the number of branches in a database, we use a specific formula. The calculation involves adding a base value of **15 branches** for the free tier, and then multiplying **5** by the total number of paid units (PU) assigned to all branches within that particular database.
               
**Max branches** = **15 (free tier)** + **5** * **#(PU)**

For example, if you have 2 paid units allocated to your branches in your database, the formula would be:

**15 (free tier)** + **5** * **2 (PU)** = **25 branches in total**


## More information

For more detailed information on pricing, billing, and usage limits, please refer to our comprehensive [pricing page](https://xata.io/pricing).

If you have any further questions or need assistance, don't hesitate contact [Support](https://support.xata.io/hc/en-us).