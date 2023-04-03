import React, {useState} from 'react';
import './Modifier.scss';


function Modifier (props) {

  const {
    modifierGroup,
    modifier,
    langData,
    level
  } = props

  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };
  
  const availableTiers = modifier.tiers.filter(tier => tier.minLevel <= level && (tier.maxLevel === -1 || tier.maxLevel >= level));
  const lowestTier = availableTiers.reduce((min, tier) => tier.minLevel < min.minLevel ? tier : min);
  const highestTier = availableTiers.reduce((max, tier) => tier.minLevel > max.minLevel ? tier : max);

  // Find up to 2 legendary tiers above the highest tier in availableTiers
  const availableLegendaryTiers = ["PREFIX", "SUFFIX"].includes(modifierGroup)
    ? modifier.tiers
      .filter((tier, index) => index > modifier.tiers.indexOf(highestTier) && index <= modifier.tiers.indexOf(highestTier) + 2)
      .sort((a, b) => a.minLevel - b.minLevel)
    : []

  function getTierDisplayForModifier(modifier, tier) {

    // Initiate variables
    var tierDisplay = "";

    // Tier doesn't have values
    if (tier.value.min === undefined && tier.value.minChance === undefined) {

    }

    // Tier has values
    else {

      // Tier values are integers
      if ((Number.isInteger(tier.value.min) && Number.isInteger(tier.value.max)) || (Number.isInteger(tier.value.minChance) && Number.isInteger(tier.value.maxChance))) {

        // Minimum and maximum values are the same
        if (tier.value.min === tier.value.max) {
          tierDisplay = `${tier.value.min}`;
        }

        // Minimum and maximum values are different
        else {
          tierDisplay = `${tier.value.min} - ${tier.value.max}`;
        }
  
      }
  
      // Tier values are floats
      else {
  
        // Modifier is implicit 'Attack Speed'
        if (modifier.identifier === "the_vault:base_attack_speed") {
          tierDisplay = `${(4.0 + tier.value.min).toFixed(1)} - ${(4.0 + tier.value.max).toFixed(1)}`;
        }

        // Modifier is "Reach", "Range" or "Speed"
        else if (modifier.attribute === "the_vault:reach" || modifier.attribute === "the_vault:range" || modifier.attribute === "the_vault:mining_speed") {
          tierDisplay = `${tier.value.min} - ${tier.value.max}`;
        }

        // Modifier is "Velocity"
        else if (modifier.attribute === "the_vault:velocity") {
          tierDisplay = `${(tier.value.min * 100).toFixed(0)} - ${(tier.value.max * 100).toFixed(0)}`
        }

        // Modifier is "Copiously"
        else if (modifier.attribute === "the_vault:copiously") {
          tierDisplay = `${(tier.value.min * 100).toFixed(1) + '%'} - ${(tier.value.max * 100).toFixed(0) + '%'}`;
        }

        // Modifier is "x Avoidance"
        else if (modifier.attribute.endsWith("avoidance")) {
          tierDisplay = `${(tier.value.minChance * 100).toFixed(0) + '%'} - ${(tier.value.maxChance * 100).toFixed(0) + '%'}`;
        }

        // Default modifier
        else {
          tierDisplay = `${(tier.value.min * 100).toFixed(0) + '%'} - ${(tier.value.max * 100).toFixed(0) + '%'}`;
        }
  
      }

    }

    // Return displayed data
    return tierDisplay;

  }

  function getModifierDisplayForTier(tier) {

    // Initiate variables
    var modifierDisplay = "";

    // Tier has tooltip display name (Cloud Modifiers)
    if (tier.value.tooltipDisplayName != null) {
      modifierDisplay = `${tier.value.tooltipDisplayName} Cloud`;
    }

    // Tier has registry key (Immunity Modifiers)
    else if (tier.value.registryKey != null) {
      modifierDisplay = `${
        tier.value.registryKey
          .replace("minecraft:", "").replace("the_vault:", "").replace("_", " ")
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      } Immunity`
    }

    // Default modifier
    else {
      modifierDisplay = `${langData.name}`;
    }

    // Return displayed data
    return modifierDisplay;

  }

  return (
    <div key={modifier.identifier} class={`gear-modifier ${expanded ? 'expanded' : ''}`}>
      <h3 onClick={handleToggle}>
        <span>
          {`
            ${
              getTierDisplayForModifier(modifier, lowestTier).split(" - ")[0] !== ""
              ? 
                `
                  ${getTierDisplayForModifier(modifier, lowestTier).split(" - ")[0]}
                  - 
                  ${
                    getTierDisplayForModifier(modifier, highestTier).split(" - ")[1] !== undefined
                    ? getTierDisplayForModifier(modifier, highestTier).split(" - ")[1]
                    : getTierDisplayForModifier(modifier, highestTier).split(" - ")[0]
                  }
                `
              : ""
            }
          `}
          <span style={{color: langData.color}}>
            {langData.name}
          </span>
        </span>
        <span>{expanded ? '-' : '+'}
        </span>
      </h3>
      {([...availableTiers, ...availableLegendaryTiers]).map((tier) => (
        <div key={tier.minLevel} className="gear-modifier-data">
          <p className="gear-modifier-values">
            {(getTierDisplayForModifier(modifier, tier) === ""
              ? ''
              : <span>{getTierDisplayForModifier(modifier, tier)}</span>
            )}
            <span className="modifier-display-for-tier" style={{color: langData.color}}>{getModifierDisplayForTier(tier)}</span>
          </p>
          <p className="gear-modifier-levels">
            {
              !availableLegendaryTiers.includes(tier)
                ? `${`Lvl ${tier.minLevel}${tier.maxLevel === -1 ? ' +' :  ` - ${tier.maxLevel}`}`}`
                : <span style={{"font-size": "14px","color": "gold"}}>◆</span>
            }
          </p>
        </div>
      ))}
    </div>
  );

}

export default Modifier;
